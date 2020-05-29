/**
 * カレンダー通知BOT
 */
const LINE_NOTIFY_TOKEN = '*****'; // LINE NOTIFY用のアクセストークン 
const WEEKDAY = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * メイン処理
 */
function main() {
    try {
        let nowDt = new Date();
        let dt = Utilities.formatDate(nowDt, 'Asia/Tokyo', `MM/dd(${WEEKDAY[nowDt.getDay()]})`);
        let message = `\n今日の予定だよ!!\n\n--- ${dt} ----\n`;

        let userMessage = '';
        let calendarList = CalendarApp.getAllCalendars();
        for (let i in calendarList) {
            let calendar = calendarList[i];
            let eventMessage = '';
            let eventList = calendar.getEventsForDay(nowDt);
            for (let j in eventList) {
                let event = eventList[j];
                eventMessage += `${getEventTime(event.getStartTime())} - ${getEventTime(event.getEndTime())} ${event.getTitle()}\n`;
            }
            if (0 < eventMessage.length) {
                userMessage += `\n< ${calendar.getName()} >\n`;
                userMessage += eventMessage;
            }
        }
        if (0 < userMessage.length) {
            message += userMessage;
        } else {
            message += '今日の予定はありません。';
        }
        sendLineNotify(message);

    } catch (e) {
        console.error(e.stack);
    }
}

/**
 * イベント時刻を取得する
 * @param {String} str 
 */
function getEventTime(str) {
    return Utilities.formatDate(str, 'Asia/Tokyo', 'HH:mm');
}

/**
 * LINEにメッセージを送信する
 * @param {String} message メッセージ 
 */
function sendLineNotify(message) {
    let url = 'https://notify-api.line.me/api/notify';
    let options = {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
        },
        'payload': `message=${message}`
    };
    let response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText('UTF-8'));
}