/* eslint-disable import/no-named-as-default */
import React from 'react';
import usePopover from '../../_hooks/use-popover';
import { LeftSidebarItem } from './SidebarItem';
import { DataSourceManager } from '../DataSourceManager';
import { DataSourceTypes } from '../DataSourceManager/SourceComponents';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import { getSvgIcon } from '@/_helpers/appUtils';
import { Confirm } from '.././Viewer/Confirm';
import { datasourceService } from '@/_services';
import toast from 'react-hot-toast';

export const LeftSidebarDataSources = ({
  appId,
  editingVersionId,
  darkMode,
  dataSources = [],
  dataSourcesChanged,
  dataQueriesChanged,
}) => {
  const [open, trigger, content] = usePopover(false);
  const [showDataSourceManagerModal, toggleDataSourceManagerModal] = React.useState(false);
  const [selectedDataSource, setSelectedDataSource] = React.useState(null);
  const [isDeleteModalVisible, setDeleteModalVisibility] = React.useState(false);
  const [isDeletingDatasource, setDeletingDatasource] = React.useState(false);

  const deleteDataSource = (selectedSource) => {
    setSelectedDataSource(selectedSource);
    setDeleteModalVisibility(true);
  };

  const executeDataSourceDeletion = () => {
    setDeleteModalVisibility(false);
    setDeletingDatasource(true);
    datasourceService
      .deleteDataSource(selectedDataSource.id)
      .then(() => {
        toast.success('Data Source Deleted');
        setDeletingDatasource(false);
        dataSourcesChanged();
        dataQueriesChanged();
      })
      .catch(({ error }) => {
        setDeletingDatasource(false);
        toast.error(error);
      });
  };

  const cancelDeleteDataSource = () => {
    setDeleteModalVisibility(false);
  };

  const renderDataSource = (dataSource, idx) => {
    const sourceMeta = DataSourceTypes.find((source) => source.kind === dataSource.kind);
    return (
      <div className="row py-1" key={idx}>
        <div
          role="button"
          onClick={() => {
            setSelectedDataSource(dataSource);
            toggleDataSourceManagerModal(true);
          }}
          className="col"
        >
          {getSvgIcon(sourceMeta.kind.toLowerCase(), 25, 25)}
          <span className="font-500" style={{ paddingLeft: 5 }}>
            {dataSource.name}
          </span>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-sm ds-delete-btn"
            onClick={() => deleteDataSource(dataSource)}
            style={
              {
                // display: this.state.showHiddenOptionsForDataQueryId === dataQuery.id ? 'block' : 'none',
              }
            }
          >
            <div>
              <img src="/assets/images/icons/query-trash-icon.svg" width="12" height="12" />
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Confirm
        show={isDeleteModalVisible}
        message={'You will lose all the queries created from this data source. Do you really want to delete?'}
        confirmButtonLoading={isDeletingDatasource}
        onConfirm={() => executeDataSourceDeletion()}
        onCancel={() => cancelDeleteDataSource()}
        darkMode={darkMode}
      />
      <LeftSidebarItem
        tip="Add or edit datasources"
        {...trigger}
        icon="database"
        className={`left-sidebar-item sidebar-datasources left-sidebar-layout ${open && 'active'}`}
        text={'Sources'}
      />
      <div {...content} className={`card popover datasources-popover ${open ? 'show' : 'hide'}`}>
        <LeftSidebarDataSources.Container
          renderDataSource={renderDataSource}
          dataSources={dataSources}
          toggleDataSourceManagerModal={toggleDataSourceManagerModal}
        />
      </div>
      <DataSourceManager
        appId={appId}
        showDataSourceManagerModal={showDataSourceManagerModal}
        darkMode={darkMode}
        hideModal={() => {
          setSelectedDataSource(null);
          toggleDataSourceManagerModal(false);
        }}
        editingVersionId={editingVersionId}
        dataSourcesChanged={dataSourcesChanged}
        selectedDataSource={selectedDataSource}
      />
    </>
  );
};

const LeftSidebarDataSourcesContainer = ({ renderDataSource, dataSources = [], toggleDataSourceManagerModal }) => {
  return (
    <div className="card-body">
      <div>
        <div className="row">
          <div className="col">
            <h5 className="text-muted">Data sources</h5>
          </div>
          <div className="col-auto">
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="top"
              delay={{ show: 800, hide: 100 }}
              overlay={<Tooltip id="button-tooltip">{'Add datasource'}</Tooltip>}
            >
              <button onClick={() => toggleDataSourceManagerModal(true)} className="btn btn-sm add-btn">
                <img className="" src="/assets/images/icons/plus.svg" width="12" height="12" />
              </button>
            </OverlayTrigger>
          </div>
        </div>
        <div className="d-flex w-100">
          {dataSources.length === 0 ? (
            <center onClick={() => toggleDataSourceManagerModal(true)} className="p-2 color-primary cursor-pointer">
              + add data source
            </center>
          ) : (
            <div className="mt-2 w-100">{dataSources?.map((source, idx) => renderDataSource(source, idx))}</div>
          )}
        </div>
      </div>
    </div>
  );
};

LeftSidebarDataSources.Container = LeftSidebarDataSourcesContainer;
