import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap';

import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      color: '#f00',
      mousedown: false,
    }

    this.download = this.download.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.handleDrawingEnd = this.handleDrawingEnd.bind(this);
    this.handleDrawingStart = this.handleDrawingStart.bind(this);
    this.handleDrawingInProgress = this.handleDrawingInProgress.bind(this);
    this.getMosuePositionOnCanvas = this.getMosuePositionOnCanvas.bind(this);
  }
  
  componentDidMount() {
    this.canvas.width = Math.min(700, window.innerWidth*0.9);
    this.canvas.height = Math.min(700, window.innerHeight*0.6);
    this.updateCanvas();
  }

  updateCanvas() {

    this.canvas.addEventListener('mousedown', this.handleDrawingStart);
    this.canvas.addEventListener('mousemove', this.handleDrawingInProgress);
    this.canvas.addEventListener('mouseup', this.handleDrawingEnd);
    this.canvas.addEventListener('mouseout', this.handleDrawingEnd);

    this.canvas.addEventListener('touchstart', this.handleDrawingStart);
    this.canvas.addEventListener('touchmove', this.handleDrawingInProgress);
    this.canvas.addEventListener('touchend', this.handleDrawingEnd);
  }

  handleDrawingStart(event) {

    var canvasContext = this.canvas.getContext('2d');

    event.preventDefault();

    const mousePos = this.getMosuePositionOnCanvas(event);
    
    canvasContext.beginPath();

    canvasContext.moveTo(mousePos.x, mousePos.y);

    canvasContext.lineWidth = 4;
    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    canvasContext.strokeStyle = this.state.color;
    canvasContext.fillStyle = this.state.color;

    canvasContext.fill();
    
    this.setState({
      mousedown: true
    })
  }

  handleDrawingInProgress(event) {

    var canvasContext = this.canvas.getContext('2d');

    event.preventDefault();
    
    if (this.state.mousedown) {
      const mousePos = this.getMosuePositionOnCanvas(event);

      canvasContext.lineTo(mousePos.x, mousePos.y);
      canvasContext.stroke();
    }
  }

  handleDrawingEnd(event) {

    var canvasContext = this.canvas.getContext('2d');

    event.preventDefault();
    
    if (this.state.mousedown) {

      canvasContext.stroke();
    }
    
    this.setState({
      mousedown: false
    })
  }

  getMosuePositionOnCanvas(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;

    return { x: canvasX, y: canvasY };
  }

  download(){
    var orientation='l';
      if(this.canvas.height>this.canvas.width){
      orientation='p';
    }
    var name = uuidv4()+'.pdf';
    var options = {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({
          'data': this.canvas.toDataURL(),
          'orientation': orientation,
          'width': this.canvas.width,
          'height': this.canvas.height,
          'name': name
      })
    }
    fetch('/generate', options).then((res)=>{
      if(res.status==200){
        window.open('/download/'+name);
      }
    });
  }

  render() {
    return (
      <Container fluid className='holder'>
        <Row>
          <Col className='column'>
            <button className='black color' onClick={()=>this.setState({color: '#000'})}/>
            <button className='red color' onClick={()=>this.setState({color: '#f00'})}/>
            <button className='blue color' onClick={()=>this.setState({color: '#00f'})}/>
            <button className='green color' onClick={()=>this.setState({color: '#0f0'})}/>
            <button className='yellow color' onClick={()=>this.setState({color: '#ff0'})}/>
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
            <button className='download' onClick={this.download}>
              Download the PDF
            </button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
