import React from 'react';
import Drawer from 'material-ui/Drawer';
import Toggle from 'material-ui/Toggle';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const renderList = (protocols) => {
  if (protocols.length > 1) {
    return protocols.map((protocol) =>
      (
        <div key={protocol.name}>
          <ListItem primaryText={protocol.name} secondaryText={protocol.status} />
          <Divider />
        </div>
      )
    )
  }
}

const SettingsMenu = (props) =>  {

  const { drawerToggle, discoveryToggle, discovery, drawer } = props

  const style = {
    AppBar: {
      margin: '0 0 20px'
    },
    Toggle: {
      margin: '0 20px 0'
    },
    Cog: {
      margin: '20px 0 0 20px',
      cursor: 'pointer'
    }
  }

  return (
    <div>
      <ActionSettings
        style={style.Cog}
        onTouchTap={() => drawerToggle(drawer)}
      />
      <Drawer open={drawer}>
        <AppBar
           title='Settings'
           style={style.AppBar}
           showMenuIconButton={false}
           iconElementRight={<IconButton
           onTouchTap={() => drawerToggle(drawer)}>
            <NavigationClose/>
           </IconButton>}
        />
        <Toggle
           label="Device Discovery"
           labelPosition="right"
           style={style.Toggle}
           onToggle={() => discoveryToggle(discovery)}
           toggled={discovery}
         />
       <List>
        {renderList(props.protocols)}
       </List>
      </Drawer>
    </div>
  )
}

export default SettingsMenu;
