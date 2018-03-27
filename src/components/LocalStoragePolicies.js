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
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const LocalStoragePolicies = (props) => {
  const { policies, handleRemoval } = props

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
    removeButton: {
      color: '#c14f54',
      cursor: 'pointer'
    },
    noPoltext: {
      fontWeight: 'bold',
      color: '#929292',
      marginTop: '30px',
      marginBottom: '30px'
    }
  }

  return (
    <List>
      <Subheader style={styles.subheader}> Local storage policies </Subheader>
      {
        policies.length === 0 
        ? <Toolbar style={styles.bar}> 
            <ToolbarGroup>
              <span style={styles.noPoltext}>No policies found, try to add a new policy first.</span>
          </ToolbarGroup>
        </Toolbar>
        : policies.map(pol => {
          return <Toolbar style={styles.bar}>
            <ToolbarGroup>
              Data from component <span style={styles.span}>{pol.componentID}</span> is fetched and stored every <span style={styles.span}>{pol.interval}</span> ms.
            </ ToolbarGroup>
            <ToolbarGroup>
              <NavigationClose style={styles.removeButton} onClick={
                () => handleRemoval(pol.deviceID, pol.componentID)
              }/>
            </ToolbarGroup>
          </Toolbar>
        })
      }
      <Divider style={styles.divider}/>
    </List>
  )
}

export default LocalStoragePolicies
