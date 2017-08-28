import React from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import { GenericListItem } from '../components';


const styles = {
  subheader : {
    padding: '0px',
    fontWeight: 'bold',
    fontSize: '15px',
    color: '#000'
  },
  fullWidthButton: {
    width: '100%'
  }
}

const LocalStoragePolicies = (props) => {
  const { policies, handleRemoval } = props
  return (
    <List>
      <Subheader style={styles.subheader}> Manage existing policies </Subheader>
      <Divider />
      {policies.map(pol => {

        {/* THIS RENDER IS FOR DEV PURPOSES ONLY */}
        return <GenericListItem
          leftEl={
            <span>
              <b>Device</b><code> {pol.deviceID} </code>
              <b>| Component</b><code> {pol.componentID} </code>
              <b>| Interval</b><code> {pol.interval} </code>
            </span>
          }

          rightEl={
            <div onClick={() => handleRemoval(pol.deviceID, pol.componentID)}>
            <span style={{fontWeight: 'bold', cursor: 'pointer'}}>
              REMOVE
            </span>
            </div>
          }
          />
      })}
    </List>
  )
}

export default LocalStoragePolicies
