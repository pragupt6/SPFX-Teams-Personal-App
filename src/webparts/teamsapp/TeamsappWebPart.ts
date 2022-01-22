import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TeamsappWebPartStrings';
import Teamsapp from './components/Teamsapp';
import { ITeamsappProps } from './components/ITeamsappProps';
import { setup as pnpSetup } from "@pnp/common";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
// initializeIcons();
// import '../../../../assets/dist/tailwind.css';
export interface ITeamsappWebPartProps {
  description: string;
}

export default class TeamsappWebPart extends BaseClientSideWebPart<ITeamsappWebPartProps> {
  public async onInit(): Promise<void> {
    return super.onInit().then(_ => {
      console.log('================context====================');
      console.log(this.context);
      console.log('====================================');
      if(this.context.sdks.microsoftTeams){
        initializeIcons();
        this._applyTheme(this.context.sdks.microsoftTeams.context.theme || 'default');
        this.context.sdks.microsoftTeams.teamsJs.registerOnThemeChangeHandler(this._applyTheme);
        sp.setup({
          spfxContext: this.context,
          sp: {
            baseUrl: `https://${this.context.sdks.microsoftTeams.context["teamSiteDomain"]}/sites/ThePerspective`
          },
        });
        graph.setup({
          spfxContext: this.context
        });
      }
      else{
        sp.setup({
          spfxContext: this.context
        });
        graph.setup({
          spfxContext: this.context
        });
      }
    });
  }
  private _applyTheme = (theme: string): void => {
    this.context.domElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }
  public render(): void {
    const element: React.ReactElement<ITeamsappProps> = React.createElement(
      Teamsapp,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
