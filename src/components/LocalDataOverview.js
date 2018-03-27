/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router';

const LocalDataOverview = (props) => {
  const styles= {
    span: {
      fontWeight: 'bold'
    },
    divider: {
      marginTop: '30px',
      margin: '30px',
      height: '1px',
      backgroundColor: '#e0e0e0'
    },
    bar: {
      whiteSpace: 'pre',
      marginTop: '15px',
      marginBottom: '15px',
      backgroundColor: '#e2e2e2',
      fontSize: '1rem'
    },
    subheader : {
      marginLeft: '0.5rem',
      padding: '0px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: '#000'
    },
    noPoltext: {
      fontWeight: 'bold',
      color: '#929292',
      marginTop: '30px',
      marginBottom: '30px'
    }
  }

  const {
    deviceId,
    recordsDelete,
    records
  } = props

  const relevant = records[deviceId]
  const componentIds = Object.keys(relevant)

  const nonEmpty = componentIds.find(id => relevant[id].length > 0)
  return (
    <List>
      <Subheader style={styles.subheader}> Locally stored data </Subheader>
      {
        nonEmpty
        ? componentIds.map(id => {
          return <Toolbar style={styles.bar}>
            <ToolbarGroup>
              <span style={styles.span}>{relevant[id].length}</span> records stored locally, from component <span style={styles.span}>{id}</span>. 
            </ ToolbarGroup>
            <ToolbarGroup>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
              >
                <Link to={`/graphs/${deviceId}`}>
                  <MenuItem primaryText='View' />
                </Link>
                <MenuItem primaryText='Remove' 
                  onClick={() => {
                    recordsDelete(deviceId, id)
                  }}
                />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>
        })
        : <Toolbar style={styles.bar}>
            <ToolbarGroup>
              <span style={styles.noPoltext}>No local data found, try to add a new policy first.</span>
            </ToolbarGroup>
        </Toolbar>

      }
      <Divider style={styles.divider}/>
    </List>
  )
}

export default LocalDataOverview
