module.exports.myDate = myDate;
module.exports.myDay = myDay;

function myDate()
{
    let options = {
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    };
    let today = new Date();
    let newDate = today.toLocaleDateString("en-US",options);
    console.log(newDate);
    return newDate;
}

function myDay()
{
    let options = {
        weekday:"long",
    };
    let today = new Date();
    let newDay = today.toLocaleDateString("en-US",options);
    console.log(newDay);
    return newDay;
}
