// Promise.all实现并发
async function executeConcurrentTasks(tasks, maxConcurrency) {
    const results = [];
    let currentIndex = 0;

    async function runTask(task) {
        const result = await task();
        results.push(result);
    }

    async function startNextTask() {
        if (currentIndex < tasks.length) {
            const task = tasks[currentIndex];
            currentIndex++;
            await runTask(task);
            startNextTask();
        }
    }

    // Start initial tasks up to maxConcurrency
    const initialTasks = tasks.slice(0, maxConcurrency);
    await Promise.all(initialTasks.map(runTask));

    // Start remaining tasks
    await startNextTask();

    return results;
}

// Usage
const tasks = [
    async () => {
        await delay(1000); // Simulate an async operation
        return "Task 1";
    },
    async () => {
        await delay(1500);
        return "Task 2";
    },
    async () => {
        await delay(1000); // Simulate an async operation
        return "Task 3";
    },
    async () => {
        await delay(1500);
        return "Task 4";
    },
    async () => {
        await delay(1000); // Simulate an async operation
        return "Task 5";
    }
    // Add more tasks here...
];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const maxConcurrency = 2; // Set the maximum number of concurrent tasks
executeConcurrentTasks(tasks, maxConcurrency)
    .then(results => {
        console.log("Results:", results);
    })
    .catch(error => {
        console.error("Error:", error);
    });




// Promise.race实现并发
// async function executeConcurrentTasks(tasks, maxConcurrency) {
//     const results = [];
//     let currentIndex = 0;

//     async function runTask(task) {
//         const result = await task();
//         results.push(result);
//     }

//     async function startNextTask() {
//         if (currentIndex < tasks.length) {
//             const task = tasks[currentIndex];
//             currentIndex++;
//             await runTask(task);
//             await startNextTask();
//         }
//     }

//     const concurrentPromises = [];

//     for (let i = 0; i < maxConcurrency; i++) {
//         if (currentIndex < tasks.length) {
//             const task = tasks[currentIndex];
//             currentIndex++;
//             concurrentPromises.push(runTask(task));
//         }
//     }

//     while (concurrentPromises.length > 0) {
//         await Promise.race(concurrentPromises);
//         concurrentPromises.shift();

//         if (currentIndex < tasks.length) {
//             const task = tasks[currentIndex];
//             currentIndex++;
//             concurrentPromises.push(runTask(task));
//         }
//     }

//     return results;
// }

// // Usage (similar to the previous example)
// const tasks = [
//     async () => {
//         await delay(1000);
//         return "Task 1";
//     },
//     async () => {
//         await delay(1500);
//         return "Task 2";
//     },
//     // Add more tasks here...
// ];

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const maxConcurrency = 2;
// executeConcurrentTasks(tasks, maxConcurrency)
//     .then(results => {
//         console.log("Results:", results);
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });



