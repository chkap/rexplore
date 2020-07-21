import React from 'react'
import SplitPane from 'react-split-pane'
import path from 'path'

import './SplitPaneResizer.css'
import './DirectoryView.css'
import DirectoryView from './DirectoryView'


class RemoteExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootNode: {
        name: '/'
      },
    };

    this.updateDir = this.updateDir.bind(this);
    this.setCurDir = this.setCurDir.bind(this);
    this.updatedFlagCache = {};
  }

  getNodePathFromIndexPath(indexPath){
    const names = ['/'];
    let curNode = this.state.rootNode;
    for(const index of indexPath) {
      curNode = curNode.dirs[index];
      names.push(curNode.name);
    }
    return path.join(...names);
  }

  updateDirWithIndex(indexPath, dirs, files) {
    let curNode = this.state.rootNode;
    for(const index of indexPath) {
      // curNode.dirs[index] = Object.assign({}, curNode.dirs[index]);
      curNode = curNode.dirs[index];
    }
    this.mergeDirNodeInfo(curNode, dirs, files);
  }

  mergeDirNodeInfo(dirNode, dirs, files) {
    const newDirDict = {};
    for(const dirName of dirs) {
      newDirDict[dirName] = {name:dirName};
    }
    const childDirNodes = dirNode.dirs || [];
    for(const oldDir of childDirNodes) {
      if(newDirDict.hasOwnProperty(oldDir.name)) {
        newDirDict[oldDir.name] = oldDir;
      }
    }
    const newDirs = Object.values(newDirDict);
    newDirs.sort((a, b) => a.name < b.name);
    console.log(`newDirs: ${newDirs}`);
    dirNode.dirs = newDirs;
    dirNode.files = files;
  }

  updateDir(indexPath) {
    const nodePath = this.getNodePathFromIndexPath(indexPath);
    if(this.updatedFlagCache[nodePath] === true) {
      return;
    }
    const url = '/api/dir?' + new URLSearchParams({path:nodePath}).toString();
    console.log(`update dir with :${url}`);
    fetch(url)
    .then(res => {
      if(res.ok){
        console.log('fetch ok');
        return res.json();
      }else{
        throw Error('Failed to get dir content!');
      }
    })
    .then(data => {
      const [dirs, files] = data;
      this.updateDirWithIndex(indexPath, dirs, files)
      this.setState({rootNode: Object.assign({}, this.state.rootNode)});
      this.updatedFlagCache[nodePath] = true;
    })
    .catch( err => {console.error(err)})
  }

  setCurDir(curPath) {
    this.setState({curPath});
  }

  render() {
    return (
      <SplitPane split="vertical" minSiz={100} maxSize={500}>
        <div style={{overflow: 'auto', height: '100%', width: '100%'}}>
        <DirectoryView rootNode={this.state.rootNode}
          updateDir={this.updateDir} setCurDir={this.setCurDir}></DirectoryView>
        </div>
      <div>{this.state.curPath}</div>
      </SplitPane>
    );
  }
}

export default RemoteExplorer;
