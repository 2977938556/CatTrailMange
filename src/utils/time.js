export let FormatTime = (value) => {
    let time = value.updated_at;
    if (!time) return "暂无时间";

    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    const now = new Date();
    const currentYear = now.getFullYear();
    let formattedDate = ""
    if (currentYear !== year) {
        let formattedDate = year + '.' + month + '.' + day;
    } else {
        let formattedDate = month + '.' + day;
    }

    return formattedDate;
}



export let FromTimeArrat = (value) => {
    if (!value) return "暂无时间";

    // 这里是获取当前的数据
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');


    const now = new Date();
    const currentYear = now.getFullYear();
    let formattedDate = ""


    // 这里的逻辑大致就是如果不等于当前的年份那么就添加年份上去否则就不需要
    if (currentYear !== year) {
        formattedDate = year + '.' + month + '.' + day;
    } else {
        formattedDate = month + '.' + day;
    }

    return formattedDate;
}