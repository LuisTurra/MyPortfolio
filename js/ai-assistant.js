const AI_URL =
"https://portfolio-ai-assistant.luisturraef.workers.dev";


async function askPortfolioAI(question){

    const response = await fetch(AI_URL,{
        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            messages:[
                {
                    role:"user",
                    content:question
                }
            ]
        })
    });


    const data = await response.json();


    return data.answer;

}