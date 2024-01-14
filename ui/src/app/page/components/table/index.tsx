/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import {
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
  ConstrainMode,
  DetailsList,
} from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import {
  CommandBar,
  ICommandBarItemProps,
  Icon,
  ShimmeredDetailsList,
  Stack,
} from "@fluentui/react";
import "./index.scss";
import { connect } from "react-redux";
import Pagination from "../pagination";
import {
  setTableSelectedCount,
  setTableSelectedItem,
} from "../../../../redux/reducers";
import { RootState } from "../../../../redux";
import { Empty } from "antd";

const classNames = mergeStyleSets({
  controlWrapper: { display: "flex", flexWrap: "wrap", paddingLeft: "20px" },
});
const controlStyles = { root: { margin: "0 30px 20px 0", maxWidth: "300px" } };

// ================

export interface IUniformTableOwnProps {
  columns: IColumn[];
  commandBarItems: ICommandBarItemProps[];
  integrateItems: (requestBody: any) => Promise<any>;
  searchByColumn: string;
  searchPlaceholder: string;
  noSelected?: boolean;
  tableContainerClassName?: string;
  sortable?: boolean
}

export interface IUniformTablePropsFromState {
  refresh: boolean;
}

export interface IUniformTablePropsFromDispatch {
  setTableSelectedCount: any;
  setTableSelectedItem: any;
}

type IUniformTableProps = IUniformTableOwnProps &
  IUniformTablePropsFromDispatch &
  IUniformTablePropsFromState;

export interface IUniformTableState {
  items: any[];
  columns: IColumn[];
  isLoading: boolean;
  page: number;
  total: number;
  pageSize: number;
  searchKey: string;
}

const mapDispatchToProps = {
  setTableSelectedCount,
  setTableSelectedItem,
};

const mapStateToProps = (state: RootState) => ({
  refresh: state.table.refresh,
});

class UniformTable extends React.Component<
  IUniformTableProps,
  IUniformTableState
> {
  private _selection: Selection;
  private _buttonSearch: any;
  private _detailListRef: any;

  constructor(props: IUniformTableProps) {
    super(props);
    this._detailListRef = React.createRef();
    this._buttonSearch = React.createRef();
    this._detailListRef = React.createRef();
    this._selection = new Selection({
      onSelectionChanged: () => {
        this.props.setTableSelectedCount(this._selection.getSelectedCount());
        this.props.setTableSelectedItem(this._selection.getSelection());
      },
    });
    this.state = {
      items: [],
      isLoading: true,
      columns: this.props.sortable ? this.props.columns.map(col => {
        return{
          ...col,
          onColumnClick: this._onColumnClick
        }
      }) : this.props.columns,
      searchKey: "",
      page: 1,
      total: 0,
      pageSize: 10,
    };
  }

  componentDidMount(): void {
    this.props.setTableSelectedCount(0);
    this.props.setTableSelectedItem([]);
    const detailListElement: any = this._detailListRef.current;
    const detailListElementHeight = detailListElement.clientHeight;
    const _pageSize = Math.floor(detailListElementHeight / 44 - 3);
    this.setState(
      {
        pageSize: _pageSize,
      },
      () => this.getData()
    );
  }

  componentDidUpdate(prevProps: Readonly<IUniformTableProps>): void {
    if (this.props.refresh !== prevProps.refresh) {
      this.OnRefresh();
    }
  }

  private getData() {
    const { searchKey, page } = this.state;
    const requestBody = {
      pageNumber: page,
      pageSize: this.state.pageSize < 0 ? 5 : this.state.pageSize,
      searchKey: searchKey.trim(),
    };
    this.setState({
      items: [],
      isLoading: true,
    });
    this.props
      .integrateItems(requestBody)
      .then((data) => {
        if (data.success) {
          this.setState({
            items: data.data.values,
            total: data.data.total,
          });
        }
      })
      .catch(() => {
        this.setState({
          items: [],
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  private getDataFilter(columnName: string, isAssending: boolean) {
    const { searchKey, page } = this.state;
    const requestBody = {
      pageNumber: page,
      pageSize: this.state.pageSize < 0 ? 5 : this.state.pageSize,
      searchKey: searchKey.trim(),
      orderBy: columnName,
      isAssending
    };
    this.setState({
      items: [],
      isLoading: true,
    });
    this.props
      .integrateItems(requestBody)
      .then((data) => {
        if (data.success) {
          // return data.data.values;
          this.setState({
            items: data.data.values,
            total: data.data.total,
          });
        }
      })
      .catch(() => {
        this.setState({
          items: [],
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  private OnRefresh() {
    this._selection = new Selection({
      onSelectionChanged: () => {
        this.props.setTableSelectedCount(this._selection.getSelectedCount());
        this.props.setTableSelectedItem(this._selection.getSelection());
      },
    });
    this.props.setTableSelectedCount(0);
    this.props.setTableSelectedItem([]);
    this.setState(
      {
        searchKey: "",
      },
      () => this.getData()
    );
  }

  private onClickSearch() {
    this.getData();
  }
  private onKeyDownSearch = (e: any) => {
    if (e.key === "Enter") {
      this._buttonSearch.current.click();
    }
  };

  private onChangePaging(value: number) {
    this.setState(
      {
        page: value,
      },
      () => this.getData()
    );
  }

  // private _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  //   const key = columnKey as keyof T;
  //   return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  // }

  private _onColumnClick = (_: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        // this.setState({
        //   announcedMessage: `${currColumn.name} is sorted ${
        //     currColumn.isSortedDescending ? 'descending' : 'ascending'
        //   }`,
        // });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    // console.log(currColumn)
    this.getDataFilter(currColumn.key, currColumn.isSortedDescending ?? true);
    // this.setState({
    //   columns: newColumns,
    //   items: newItems,
    // });
  };

  public render() {
    const { items, columns, isLoading, total, pageSize } = this.state;
    const commandBar: ICommandBarItemProps[] = [
      ...this.props.commandBarItems,
      {
        key: "refresh",
        text: "Tải lại",
        iconProps: { iconName: "Refresh" },
        onClick: this.OnRefresh.bind(this),
      },
    ];

    return (
      <Stack
        className={`table-container ${this.props.tableContainerClassName}`}
        onKeyDown={this.onKeyDownSearch.bind(this)}
      >
        <div className="details-list">
          <div className="details-list-sub-header">
            <div className="details-list-sub-header-item">
              <CommandBar items={commandBar} />
            </div>
            <div
              className={`${classNames.controlWrapper} details-list-sub-header-item`}
            >
              <TextField
                placeholder={`Tìm kiếm theo ${this.props.searchPlaceholder}`}
                onChange={this._onChangeText as any}
                styles={controlStyles}
                disabled={isLoading}
                value={this.state.searchKey}
              />
              <div
                className={`details-list-sub-header-item-icon ${
                  isLoading ? "disable" : ""
                }`}
                onClick={this.onClickSearch.bind(this)}
                ref={this._buttonSearch}
              >
                <Icon iconName={"Search"} />
              </div>
            </div>
          </div>
          <div
            className={`details-list-wrapper ${
              this.props.noSelected ? "details-list-no-selection" : ""
            }`}
            ref={this._detailListRef}
            style={{
              overflow: isLoading ? "hidden" : "auto"
            }}
          >
            <MarqueeSelection selection={this._selection}>
              {isLoading ? (
                <ShimmeredDetailsList
                  items={items}
                  columns={columns}
                  enableShimmer={true}
                  className="shimmertable"
                  selectionMode={
                    this.props.noSelected
                      ? SelectionMode.none
                      : SelectionMode.single
                  }
                />
              ) : (
                <DetailsList
                  items={items}
                  columns={columns}
                  selectionMode={
                    this.props.noSelected
                      ? SelectionMode.none
                      : SelectionMode.single
                  }
                  setKey="single"
                  layoutMode={DetailsListLayoutMode.justified}
                  constrainMode={ConstrainMode.unconstrained}
                  isHeaderVisible={true}
                  selection={this._selection}
                  selectionPreservedOnEmptyClick={true}
                  enterModalSelectionOnTouch={true}
                  listProps={{
                    renderedWindowsAhead: 0,
                    renderedWindowsBehind: 0,
                  }}
                />
              )}
            </MarqueeSelection>
            {items?.length === 0 && !isLoading && (
              <div className="details-list-no-content">
                <Empty description={false} />
                <p style={{ opacity: "0.5" }}>Không có dữ liệu</p>
              </div>
            )}
          </div>
          {/* {(total > pageSize && !isLoading) ?  */}
          <div
            key={JSON.stringify(total > pageSize && !isLoading)}
            className="details-list-paging"
            style={{
              visibility: total > pageSize && !isLoading ? "visible" : "hidden",
              height: total > pageSize && !isLoading ? "60px" : "0px",
            }}
          >
            <Pagination
              pageTotal={Math.ceil(total / pageSize)}
              postPerPage={10}
              callback={this.onChangePaging.bind(this)}
              disable={isLoading}
            />
          </div>
          {/* : <></>} */}
        </div>
      </Stack>
    );
  }

  private _onChangeText = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ) => {
    this.setState({
      searchKey: text,
      page: 1 
    });
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(UniformTable);
