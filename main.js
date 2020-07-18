console.log('Hello World!');
const name= 'John';
const y=undefined;
console.log(typeof y); 
const fruits=['apples','pears','oranges'];
console.log(fruits);
fruits.push('mangoes');
console.log(fruits);
console.log(Array.isArray(fruits));
const person={
    firstName:'Vardhan',
    lastName:'Shah',
    age:30,
    address: {
        Street:'xyz',
        city:'Surat',
        State:'Guj',
    }
}
console.log(person.address);
const todos=[
    {
        id: 1,
        text:'take out trash',
        isCompleted:true,
    }
]
console.log(todos[0]);
