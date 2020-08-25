import React from 'react';
import './App.css';
import * as marked from 'marked';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_MARKDOWN_SOURCE = "## Welcome to markdown rendered";

function MarkdownFile(name, source) {
  return ({name, source, id: uuidv4()});
}

function Header() {
  return(
    <div className="w3-bar w3-blue w3-padding w3-card-4" style={{marginBottom: '10px'}}>
      <h3>Markdown notes</h3>
    </div>
  );
}

function FilePane({fileList, selectFile, addFile}) {
  return(<div style={{flex: 1}}>
    <div className="w3-bar" style={{marginLeft: '20px'}}>
      <h4 className="w3-opacity">File List</h4>
    </div>
    <div className="w3-ul w3-border w3-card w3-margin  w3-white">
      {
        fileList.map(file => (<li id={file.id} onClick={() => selectFile(file.id)}>{file.name}</li>))
      }
      {
        (<li id={'add'} onClick={addFile}>Add new file</li>)
      }
    </div>
  </div>);
}

function FileDisplay({fileContent, onChange}) {
  return(<div  style={{flex: 3}}>
    <div className="w3-bar"  style={{marginLeft: '20px'}}>
    <h4 className="w3-opacity">Content</h4></div>
    <textarea className="w3-card-2 w3-margin" style={{ width: "90%", height: "90%", border:0}} value={fileContent} onChange={onChange}/>
    </div>);
}

function Renderer({fileContent}) {
  return(<div  style={{flex: 3}}>
    <div className="w3-bar"  style={{marginLeft: '20px'}}><h4 className="w3-opacity"> Render</h4></div>
    <div className="w3-margin w3-card-2 w3-white w3-padding" style={{width: "90%", height: "90%"}} dangerouslySetInnerHTML={{__html: marked(fileContent)}}></div>
  </div>);
}

function AppComponent({fileList, selectFile, addFile, fileContent, onChange}) {
  return (
    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <Header></Header>
      <div style={{display: "flex", flexDirection: "row", alignContent: "stretch", flex: 1}}>
        <FilePane fileList={fileList} selectFile={selectFile} addFile={addFile} />
        <FileDisplay fileContent={fileContent} onChange={onChange}/>
        <Renderer fileContent={fileContent}/>
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    const defaultFile = MarkdownFile("default.md", DEFAULT_MARKDOWN_SOURCE);
    this.state = {
      selectedFile: defaultFile.id,
      files: [defaultFile]
    };
    this.onChange = this.onChange.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.addFile = this.addFile.bind(this);
  }

  onChange(e) {
    const content = e.target.value;
    const files = this.state.files.map(f => {
      if(f.id == this.state.selectedFile) {
        f.source = content;
      }
      return f;
    });
    this.setState({
      ...this.state,
      files,
    });
  }

  addFile() {
    const newFile = MarkdownFile('customMarkdownFile', DEFAULT_MARKDOWN_SOURCE);
    this.setState({
      ...this.state,
      selectFile: newFile.id,
      files: [...this.state.files, newFile],
    });
  }

  selectFile(id) {
    this.setState({
      ...this.state,
      selectedFile: id,
    });
  }

  render(){
    console.log(this.state);
    return (
      <AppComponent 
      addFile={this.addFile}
      fileList={this.state.files.map(({name, id}) => ({name, id}))}
      selectFile={this.selectFile}
      fileContent={this.state.files.filter(({id}) => id == this.state.selectedFile)[0].source}
      onChange={this.onChange} />
    );
  }
}

export default App;
