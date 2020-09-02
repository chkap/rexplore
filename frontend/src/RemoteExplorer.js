import React from 'react'
import SplitPane from 'react-split-pane'
import path from 'path'
import DirectoryTreeView from './DirectoryTreeView'
import DirectoryContentView from './DirectoryContentView'
import ExplorerContext from './context'

import './SplitPaneResizer.css'


class RemoteExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootNode: {
        name: 'ROOT'
      },
      curDir: [],
    };

    this.updateDir = this.updateDir.bind(this);
    this.setCurDir = this.setCurDir.bind(this);
    this.updatedFlagCache = {};
    this.contextApi = {
      updateDir: this.updateDir,
      setCurDir: this.setCurDir,
    };
  }

  componentDidMount() {
    this.updateDir([]);
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

  getNodeFromIndexPath(indexPath) {
    let curNode = this.state.rootNode;
    for(const index of indexPath) {
      curNode = curNode.dirs[index];
    }
    return curNode;
  }

  updateDirWithIndex(indexPath, dirs, files) {
    let curNode = this.state.rootNode;
    for(const index of indexPath) {
      curNode.dirs[index] = Object.assign({}, curNode.dirs[index]);
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
    console.debug(`newDirs: ${newDirs}`);
    dirNode.dirs = newDirs;
    dirNode.files = files;
  }

  updateDir(indexPath, forceUpdate=false) {
    const nodePath = this.getNodePathFromIndexPath(indexPath);
    if(!forceUpdate && this.updatedFlagCache[nodePath] === true) {
      return;
    }
    const url = '/api/dir?' + new URLSearchParams({path:nodePath}).toString();
    console.debug(`update dir with :${url}`);
    fetch(url)
    .then(res => {
      if(res.ok){
        console.debug('fetch ok');
        return res.json();
      }else{
        throw Error('Failed to get dir content!');
      }
    })
    .then(data => {
      const [dirs, files] = data;
      dirs.sort();
      files.sort();
      this.updateDirWithIndex(indexPath, dirs, files)
      this.setState({
        rootNode: Object.assign({}, this.state.rootNode),
      });
      this.updatedFlagCache[nodePath] = true;
    })
    .catch( err => {console.error(err)})
  }

  setCurDir(curPath) {
    console.debug('curPath:' + curPath);
    this.setState({curDir: curPath});
  }

  render() {

    return (
      <ExplorerContext.Provider value={this.contextApi}>
        <SplitPane split="vertical" defaultSize={250} minSize={100} maxSize={500}>
          <DirectoryTreeView rootNode={this.state.rootNode}></DirectoryTreeView>
          <DirectoryContentView rootNode={this.state.rootNode} indexPath={this.state.curDir}></DirectoryContentView>
        </SplitPane>
      </ExplorerContext.Provider>
    );
  }
}

export default RemoteExplorer;
export { ExplorerContext };
