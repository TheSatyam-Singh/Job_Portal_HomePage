/*let a = document.querySelector("p");

console.log(a);

//a.innerText="<h2>Welcome to Full Stack</h2>";

a.innerHTML="<h2>Welcome to Full Stack</h2>";

a.style.backgroundColor='green';


let b=document.querySelector("body");
b.style.backgroundColor='rgb(119, 231, 194)';


let btn=document.querySelector("#btn1");

/*btn.addEventListener("click",function(){
    b.style.backgroundColor='red';   });

function eventHandler(){
    b.style.backgroundColor='red';
}

btn.addEventListener("click",eventHandler);

color=['red','green','blue','yellow','pink','purple','cyan'];

let i=0;
function eventHandler(){
    b.style.backgroundColor=color[i];
    i++;
    if(i==color.length){
        i=0;
    }
}. 

*/





document.querySelector("#input1")

let input1=document.querySelector("button")
let btn1=document.querySelector("#btn1")

let list=document.querySelector("ol")

btn1.addEventListener("click",function(){
    let taskdata=input1.value;
    if (taskdata==""){
        alert("Please Enter Your Task");
        return;
    }
    let li=document.createElement("li");
    li.innerText=taskdata;
    list.appendChild("li");

    taskdata="";

})