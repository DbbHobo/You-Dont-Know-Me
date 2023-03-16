// const arr = [1, 2, 3]

// arr.reduce((acc, x, idx, arr) => {
//     return acc.then(new Promise(r => setTimeout(() => r(console.log(x, idx)), 1000)))
// }, Promise.resolve())


// function red() {
//     console.log('red');
// }
// function green() {
//     console.log('green');
// }
// function yellow() {
//     console.log('yellow');
// }

// const step = (time, fn) => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             fn()
//             resolve()
//         }, time);
//     })
// }
// const shine = () => {
//     Promise.resolve().then(() => {
//         return step(3000, red)
//     }).then(() => {
//         return step(2000, yellow)
//     }).then(() => {
//         return step(1000, green)
//     }).then(() => {
//         return shine()
//     })
// }
// shine()


const time = (timer) => {
    return new Promise(resolve => {
        setTimeout(() => {
        resolve()
        }, timer)
    })
}
const ajax1 = () => time(2000).then(() => {
    console.log(1);
    return 1
})
const ajax2 = () => time(1000).then(() => {
    console.log(2);
    return 2
})
const ajax3 = () => time(1000).then(() => {
    console.log(3);
    return 3
})

function mergePromise (arr) {
    // 在这里写代码
    let result = [];
    let pro = Promise.resolve()
    for (let ajax of arr){
        pro = pro.then(ajax).then((res) => {
            result.push(res)
            return result
        })
    }
    return pro
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log("done");
    console.log(data); // data 为 [1, 2, 3]
});


function limitLoad(urls, handler, limit) { 
    let promises = urls.split(0, 3)
    promises = promises.map((url, idx)=>{
        return handler(url).then(()=>url)
    })
    return urls.reduce((acc,url) => {
        return acc.then(() => {
            return Promise.race(promises).then(() => {
                promises[fastestIndex] = handler(url).then(
                    () => {
                        return fastestIndex;
                    }
                );
            })
        })
    },Promise.resolve())
}
limitLoad(urls, loadImg, 3)
.then(res => {
    console.log("图片全部加载完毕");
    console.log(res);
})
.catch(err => {
    console.error(err);
});
