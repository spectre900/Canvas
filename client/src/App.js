import React, { Component } from 'react';
import { jsPDF } from 'jspdf';

import './App.css';

class App extends Component {
  
  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas() {

    const c = this.refs.drawingBox;
    c.addEventListener("mousedown", setLastCoords); // fires before mouse left btn is released
    c.addEventListener("mousemove", freeForm);

    const ctx = c.getContext("2d");

    function setLastCoords(e) {
        const {x, y} = c.getBoundingClientRect();
        lastX = e.clientX - x;
        lastY = e.clientY - y;
    }

    function freeForm(e) {
        if (e.buttons !== 1) return; // left button is not pushed yet
        penTool(e);
    }

    function penTool(e) {
        const {x, y} = c.getBoundingClientRect();
        const newX = e.clientX - x;
        const newY = e.clientY - y;

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(newX, newY);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        lastX = newX;
        lastY = newY;
    }

    let lastX = 0;
    let lastY = 0;  
  }

  print(){
    var imgData = document.getElementById('drawingBox').toDataURL('image/PNG');
    var pdf = new jsPDF('l', 'px',[500, 500]);
    pdf.addImage(imgData, 'PNG', 0, 0, 500, 500);
    window.open(URL.createObjectURL(pdf.output("blob")))
  }

  render() {
    return (
      <div>
        <canvas id='drawingBox' ref='drawingBox' width='500px' height='500px' className='drawingBox'>
        </canvas>
        <button onClick={this.print.bind(this)}>
          print
        </button>
      </div>
    );
  }
}

export default App;
