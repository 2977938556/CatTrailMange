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

    if (currentYear !== year) {
        var formattedDate = year + '.' + month + '.' + day;
    } else {
        var formattedDate = month + '.' + day;
    }

    return formattedDate;
}



export let FromTimeArrat = (value) => {
    if (!value) return "暂无时间";
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    var formattedDate = year + '.' + month + '.' + day;

    return formattedDate
}