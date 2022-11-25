async function init() {
    const buttonSubmit = document.getElementById('submit')
    buttonSubmit.addEventListener('click', async () => {
        const task = document.getElementById('task').value
        const hour = document.getElementById('hour').value
        const startDate = document.getElementById('startDate').value
        const endDate = document.getElementById('endDate').value
        const cookies = document.getElementById('cookies').value
        const businessDays = getBusinessDays(startDate, endDate)
        console.log(businessDays)
        const data = businessDays.map(day => ({
            timeSpent: Number(hour) * 60 + 'm',
            comment: {
                type: "doc",
                version: 1,
                content: []
            },
            started: day.slice(0, day.length - 4) + '000+0700'
        }))
        let totalSuccess = 0
        let final = null
        for (const d of data) {
            setTimeout(async () => {
                const res =  await postData(task, d, cookies)
                console.log(res)
            }, 1000)
        }
        alert(totalSuccess)
        console.log(final)
    })
}

const getBusinessDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(startDate);
  const dates = [];

  while (current <= end) {
    if (current.getDay() !== 6 && current.getDay() !== 0) {
      dates.push(new Date(current).toISOString());
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

async function postData(task = '', data = {}, cookie) {
  const url = `https://datisan.atlassian.net/rest/internal/3/issue/${task}/worklog?adjustEstimate=auto`
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    cookie,
    redirect: 'follow',
    cookie: document.cookie,
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  return response.json();
}

init()