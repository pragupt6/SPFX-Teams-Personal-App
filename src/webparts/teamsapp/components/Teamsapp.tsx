import * as React from 'react';
import styles from './Teamsapp.module.scss';
import { ITeamsappProps } from './ITeamsappProps';
import WebFont from 'webfontloader';
import { sp } from '@pnp/pnpjs';
import '../../../../assets/dist/tailwind.css';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import Skeleton from 'react-loading-skeleton';
import _ from 'lodash';
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";
import StartForm from './StartForm';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { HashRouter, Route, Link } from "react-router-dom";
import DraftCard from './DraftCard';
import HomeScreen from './HomeScreen';
import FormScreen from './FormScreen';
import AboutScreen from './AboutScreen';
// import ThemeContext from './AppContext';
// import AppContext from './AppContext';
import { AppContextProvider } from './AppContext';
export default class Teamsapp extends React.Component<ITeamsappProps, any> {

  constructor(props) {
    super(props);
    this.state = {

    };
    WebFont.load({
      google: {
        families: ['Droid Sans', 'Chilanka']
      }
    });

  }
  public async componentDidMount() {

  }
  public render(): React.ReactElement<ITeamsappProps> {

    return (
      // <AppContext value=''>
      <AppContextProvider>
        <HashRouter>
          <div className={``}>
            <Route path='/' render={(props) => <HomeScreen props={this.props} />} exact />
            {/* <Route path='/form' component={FormScreen} /> */}
          </div>
        </HashRouter>
      </AppContextProvider>

    );
  }
}
