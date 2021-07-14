import React, { Component } from 'react';
import { jsPDF } from 'jspdf';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap';

import './App.css';

class App extends Component {

  constructor() {
    super();
    this.color = '#000';
    this.updateCanvas = this.updateCanvas.bind(this);
  }
  
  componentDidMount() {
    this.canvas.width = Math.min(700, window.innerWidth*0.9);
    this.canvas.height = Math.min(700, window.innerHeight*0.6);
    this.updateCanvas();
  }

  updateCanvas() {

    const canvas = this.canvas;
    const canvasContext = canvas.getContext('2d');

    const state = {
      mousedown: false
    };

    canvas.addEventListener('mousedown', handleWritingStart);
    canvas.addEventListener('mousemove', handleWritingInProgress);
    canvas.addEventListener('mouseup', handleDrawingEnd);
    canvas.addEventListener('mouseout', handleDrawingEnd);

    canvas.addEventListener('touchstart', handleWritingStart);
    canvas.addEventListener('touchmove', handleWritingInProgress);
    canvas.addEventListener('touchend', handleDrawingEnd);


    function handleWritingStart(event) {

      event.preventDefault();

      const mousePos = getMosuePositionOnCanvas(event);
      
      canvasContext.beginPath();

      canvasContext.moveTo(mousePos.x, mousePos.y);

      canvasContext.lineWidth = 3;
      canvasContext.strokeStyle = this.state.color;

      canvasContext.fill();
      
      state.mousedown = true;
    }

    function handleWritingInProgress(event) {
      event.preventDefault();
      
      if (state.mousedown) {
        const mousePos = getMosuePositionOnCanvas(event);

        canvasContext.lineTo(mousePos.x, mousePos.y);
        canvasContext.stroke();
      }
    }

    function handleDrawingEnd(event) {
      event.preventDefault();
      
      if (state.mousedown) {

        canvasContext.stroke();
      }
      
      state.mousedown = false;
    }

    function getMosuePositionOnCanvas(event) {
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      const { offsetLeft, offsetTop } = event.target;
      const canvasX = clientX - offsetLeft;
      const canvasY = clientY - offsetTop;

      return { x: canvasX, y: canvasY };
    }

  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col className='column'>
            <button className='black'/>
            <button className='red' />
            <button className='blue' />
            <button className='green' />
            <button className='yellow' />
          </Col>
        </Row>
        <Row>
          <Col className='column'>
            <canvas ref={(ref) => (this.canvas = ref)} className='drawingBox'>
            </canvas>
          </Col>
        </Row>
        <Row>
          <Col className='column'>
            <button className='download'>
              Download the PDF
            </button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
