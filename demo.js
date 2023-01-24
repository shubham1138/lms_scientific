//for keeping our display updated with current values
function updatedisp() {
    htmlcurrvalue.innerHTML = this.currvalue;
    htmlprevalue.innerHTML = this.prevalue;
    htmlprevalue.innerHTML += this.tostoreoperator;
  }
  
  //for turning diplay on/off
  function is_on(clicker) {
    flag ? (this.flag = false) : (this.flag = true);
  
    //when calc is turned off then clear the display
    if (!flag) {
      clearAll();
      clicker.style.backgroundColor = "inherit";
      clicker.textContent = "OFF";
    } else {
      clicker.style.backgroundColor = "brown";
      clicker.textContent = "ON";
    }
  }
  
  //for storing the history after every calculations
  function history() {
    let hist = {
      date: new Date().toLocaleTimeString(),
      previous: this.prevalue,
      oper: this.tostoreoperator,
      curr: this.currvalue,
      ans: this.ans,
    };

    let calc = [];
    calc.push(hist);
    localStorage.setItem("calc", JSON.stringify(calc));
  }
  
  //for retrieving history when history icon is clicked
  function gethistory() {
    let calculation = JSON.parse(localStorage.getItem("calc") || "[]");
    var toplace = document.querySelector(".history");
    let p = document.createElement("p");
    toplace.appendChild(p);
  
    //to dynamically write history into html page
    calculation.forEach(function (item) {
      let pel = document.createElement("p");
      let txt = document.createTextNode(item);
      pel.append(item.date);
      pel.append("\n");
      pel.append(item.previous);
      pel.append("\n");
      pel.append(item.oper);
      pel.append(" ");
      pel.append(item.curr);
      pel.append(" ");
      pel.append(item.ans);
      p.append(pel);
    });
  }
  
  //for all the memory related function
  function memset(val) {
    if (val == "MS") this.mem = this.prevalue;
  
    if (val == "MR") {
      this.currvalue = this.mem;
    }
  
    if (val == "MC") this.mem = 0;
  
    if (val == "M+") {
      this.prevalue = parseFloat(this.mem) + parseFloat(this.prevalue);
    }
  
    if (val == "M-") {
      this.prevalue = parseFloat(this.mem) - parseFloat(this.currvalue);
      this.currvalue = "";
    }
  
    updatedisp();
  }
  
  // You can make all the parameters optional in JavaScript by not passing any argument to the function call.
  function calculate(has_two_operand) {
    //edge cases for invalid operations
    if (
      (this.prevalue === "" && has_two_operand) ||
      this.currvalue === "" ||
      !this.tostoreoperator
    ) {
      return;
    }
    
    let temp_value;
    
    this.currvalue = parseFloat(this.currvalue);
    temp_value = this.currvalue;

    if (this.prevalue) {
      this.prevalue = parseFloat(this.prevalue);
      temp_value = this.prevalue;
    }
  
  
    if (this.tostoreoperator == "1/x") ans = 1 / temp_value;
    if (this.tostoreoperator == "$") ans = temp_value / 81;
    if (this.tostoreoperator == "rs") ans = temp_value * 81;
    if (this.tostoreoperator == "sqrt") ans = Math.sqrt(temp_value);
    if (this.tostoreoperator == "log") ans = Math.log10(temp_value);
    if (this.tostoreoperator == "e") ans = Math.exp(temp_value);
    if (this.tostoreoperator == "|x|") ans = Math.abs(temp_value);
    if (this.tostoreoperator == "10**x") ans = Math.pow(10, currvalue);
    if (this.tostoreoperator == "+") ans = this.prevalue + this.currvalue;
    if (this.tostoreoperator == "-") ans = this.prevalue - this.currvalue;
    if (this.tostoreoperator == "x") ans = this.currvalue * this.prevalue;
    if (this.tostoreoperator == "/") ans = this.prevalue / this.currvalue;
    if (this.tostoreoperator == "mod") ans = this.prevalue % this.currvalue;
    if (this.tostoreoperator == "x**y") ans = this.prevalue ** this.currvalue;
    if (this.tostoreoperator == "n!") {
      let helper = 1;
      while (temp_value) {
        helper *= temp_value;
        temp_value--;
      }
      ans = helper;
    }
  
    //to save the history in array of object
    history();
  
    //after calculation clear the operator and now wait for new currvalue and operator
    this.prevalue = ans.toString();
    if (this.prevalue.includes(".")) {
      this.prevalue = this.prevalue.slice(0, this.prevalue.indexOf(".") + 4);
    }
    this.tostoreoperator = "";
    this.currvalue = "";
    updatedisp();
  }
  
  //for clearing values when clear is clicked
  function clearAll() {
    currvalue = "";
    prevalue = "";
    tostoreoperator = "";
    updatedisp();
  }
  
  //listens whenever the number is pressed
  function append(number) {
    //for handling illegal input from user
    if (number === "." && currvalue.includes(".")) return;
    if (
      (number === "-" && currvalue) 
    )
      return;
  
    currvalue = currvalue.toString() + number.toString();
  }
  
  //executes on pressing the operator and routes to calculate function
  function listenOperator(operator) {
    if (this.prevalue && this.currvalue && this.tostoreoperator) calculate(true);
  
    //if this is first "-" like -6 then it should'nt be acting like an operator
    if (this.currvalue === "-") return;
  
    // if the user is asking for constant then just give it right away
    if (operator == "pi") {
      this.currvalue = "3.14";
      updatedisp();
      return;
    }
  
    if (operator == "e") {
      this.currvalue = "2.718281828";
      updatedisp();
      return;
    }
  
    this.tostoreoperator = operator;
  
    //if user clicked without any number
    if (this.currvalue === "") return;
  
    /*if the user is asking for operation which require one operand
        list of operation which only needs single operand*/
    let single_operation = [
      "1/x",
      "c",
      "|x|",
      "sqrt",
      "n!",
      "ln",
      "log",
      "10**x",
      "$",
      "rs",
    ];
    if (single_operation.includes(this.tostoreoperator)) {
      calculate(false);
      return;
    }
  
    if (this.prevalue === "") {
      //check for single operand operation here
      this.prevalue = this.currvalue;
      this.currvalue = "";
    } else {
      calculate(true);
    }
  }
  // to remove the last character from string
  function removeLast() {
    currvalue = currvalue.slice(0, -1);
    updatedisp();
  }
  
  //code execution starts from here
  var ans = 0;
  var prevalue = "";
  var currvalue = "";
  var tostoreoperator = "";
  var mem = 0;
  var flag = true;
  
  //storing dom elements in constant variables
  const htmlprevalue = document.querySelector("[data-htmlprevalue]");
  const htmlcurrvalue = document.querySelector("[data-htmlcurrvalue]");
  const number = document.querySelectorAll("[data-number]");
  const operator = document.querySelectorAll("[data-operator]");
  const clear = document.querySelector("[data-clear]");
  const remove_last = document.querySelector("[data-delete]");
  const eql = document.querySelector("[data-equal]");
  const memory = document.querySelectorAll("[data-memory]");
  
  //to display the date
  htmlprevalue.textContent = new Date().toLocaleTimeString();
  
  //when a number is clicked
  number.forEach((item) => {
    item.addEventListener("click", function () {
      if (flag) {
        append(item.innerText);
        updatedisp();
      }
    });
  });
  
  //when clear button is clicked
  clear.addEventListener("click", clearAll);
  
  //when an operator is clicked
  operator.forEach((item) => {
    item.addEventListener("click", function () {
      if (flag) {
        listenOperator(item.innerHTML);
      }
    });
  });
  
  //when "=" button is clicked
  eql.addEventListener("click", () => {
    if (flag) {
      calculate();
      updatedisp();
    }
  });
  
  // when we want to remove last digit
  remove_last.addEventListener("click", removeLast);
  
  //for operations involving memory
  memory.forEach((item) => {
    item.addEventListener("click", function () {
      if (flag) {
        memset(item.innerHTML);
      }
    });
  });