import React from 'react';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ToolBar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'

import RemoteExplorer from './RemoteExplorer'
import './App.css';
import './DirectoryView.css'


function App() {
  return (
    <Box className="App" display="flex" flexDirection="column">
      <Box flexGrow={0}>
      <AppBar position="static">
        <ToolBar>
          <Typography variant='h6'>
            Remote Explorer
          </Typography>
        </ToolBar>
      </AppBar>
      </Box>
      <Box flexGrow={1} className="App-container">
        <RemoteExplorer root='/'></RemoteExplorer>
      </Box>
      
    </Box>
    
  );
}

export default App;
