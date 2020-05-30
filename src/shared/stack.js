export class Stack {
    constructor(initialData){
        this.data = initialData || [];
        this.top = this.data.length;
    }

    push (el) {
        this.data[this.top] = el;
        this.top++;
    }

    get length() {
        return this.top;
    }

    splice(index, number) {
        this.top -= number;
        return this.data.splice(index, number);
    }

    peek () {
        return this.data[this.top -1 ];
    }

    pop () {
        this.top--;
        return this.data.pop();
    }
}