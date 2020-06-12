import React, { Component } from "react";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Collapse from "react-bootstrap/Collapse";
import ReactBootstrapSlider from "react-bootstrap-slider";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import "./Sidebar.css";
import axios from "axios";
import Results from "./Results";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class SearchSidebar extends Component {
  constructor() {
    super();

    this.state = {
      sliderCurrentValue: [0, 5000],
      sliderStep: 50,
      sliderMax: 5000,
      sliderMin: 0,

      sexe: null,
      size: [],
      color: [],
      subcategory: null,
      category: null,
      orderBy: "Popularity",
      sortBy: "desc",

      subcategories: null,
      isSubCategoryReady: false,

      categories: null,
      isCategoryReady: false,

      colors: null,
      isColorsReady: false,

      showFilter: false,

      isResultsReady: false,

      searchValue: null,

      resultExist: true,

      justArrived: true,
    };

    this.handleName = this.handleName.bind(this);
    this.sliderChangeValue = this.sliderChangeValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSexe = this.handleSexe.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleSubCategory = this.handleSubCategory.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.handleSortBy = this.handleSortBy.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.checkEmptyArray = this.checkEmptyArray.bind(this);
    this.checkNull = this.checkNull.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.defaultValueSexe = this.defaultValueSexe.bind(this);
    this.defaultValueName = this.defaultValueName.bind(this);
    // this.checkIfCatsubcatExists = this.checkIfCatsubcatExists.bind(this);
  }

  handleName(e) {
    this.setState({ searchValue: e.target.value, isResultsReady: false });
  }

  sliderChangeValue(e) {
    this.setState({ sliderCurrentValue: e.target.value, isResultsReady: false });
  }

  handleSexe(e) {
    this.setState({ sexe: e.target.value, isResultsReady: false });
  }

  handleSize(e) {
    let sizes = this.state.size;
    let checkSize = sizes.indexOf(e.target.value);
    let newSizes = [...sizes];

    if (checkSize === -1) {
      newSizes.push(e.target.value);
    } else {
      for (var i = 0; i < newSizes.length; i++) {
        if (newSizes[i] === e.target.value) {
          newSizes.splice(i, 1);
          i--;
        }
      }
    }

    this.setState({ size: newSizes });
  }

  handleColor(e) {
    let colors = this.state.color;
    let checkColor = colors.indexOf(e.target.value);
    let newColors = [...colors];

    if (checkColor === -1) {
      newColors.push(e.target.value);
    } else {
      for (var i = 0; i < newColors.length; i++) {
        if (newColors[i] === e.target.value) {
          newColors.splice(i, 1);
          i--;
        }
      }
    }

    this.setState({ color: newColors });
  }

  handleSubCategory(e) {
    e.preventDefault();

    console.log(e.target.value);
    this.setState({ subcategory: e.target.value });
  }

  handleCategory(e) {
    e.preventDefault();

    console.log(e.target.value);
    this.setState({ category: e.target.value });

    axios
      .get("http://localhost:8000/api/category/")
      .then(async (res) => {
        console.log(res.data.data);
        await this.setState({ categories: res.data.data, subcategory: null, isCategoryReady: true });

        res.data.data.map(cat => {
          if ( this.state.category == cat.name ) {
            this.setState({ subcategories: cat.subCategories, isSubCategoryReady: true });
          }
        })
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async handleOrderBy(e) {
    await this.setState({ orderBy: e.target.text });
    if (!this.state.showFilter) {
      this.handleSubmit()
    }
    else {
      toast.dark('Close filter\'s box', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }

  async handleSortBy(e) {
    await this.setState({ sortBy: e.target.value });
    if (!this.state.showFilter) {
      this.handleSubmit()
    } 
    else {
      toast.dark('Close filter\'s box', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }

  checkEmptyArray(array) {
    if (array.length > 0) {
      return array;
    } else {
      return null;
    }
  }

  checkNull(value) {
    if (value == ''){
      return true;
    }
  }

  handleSubmit(e) {
    let jsonRequest = {
      price: {
        start: this.state.sliderCurrentValue[0],
        end: this.state.sliderCurrentValue[1],
      },
      sex: this.state.sexe,
      size: this.checkEmptyArray(this.state.size),
      color: this.checkEmptyArray(this.state.color),
      subcategory: this.checkNull(this.state.subcategory) ? null : this.state.subcategory,
      category: this.checkNull(this.state.category) ? null : this.state.category,
      order_by: this.state.orderBy.toLowerCase(),
      order_by_sort: this.state.sortBy,
      search: this.state.searchValue
    };

    if (e) {
      e.preventDefault();
    }
    console.log(jsonRequest);

    const header = { "Content-Type": "application/json" };

    axios
      .post(
        "http://localhost:8000/api/product/filter?offset=0&limit=10",
        jsonRequest,
        { headers: header }
      )
      .then((res) => {
        this.setState({results: res.data, isResultsReady: true});
        if (this.state.showFilter == true){
          this.showFilter()
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  showFilter() {
    this.setState({ showFilter: !this.state.showFilter, justArrived: false });
  }

  // checkIfCatsubcatExists(catsubcat) {
  //   console.log(catsubcat)
  //   axios
  //   .post("http://localhost:8000/api/product/search", { search: catsubcat }, { "Content-Type": "application/json" })
  //   .then(async (res) => {
  //     console.log(res.data.catsubcat);
      
  //       if (
  //         res.data.catsubcat[0].category.length < 1 ||
  //         res.data.catsubcat[1].subcategory.length < 1
  //       ) {
  //         await this.setState({subcategory: null, category: null})
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error.response);
  //     });
  // }

  componentDidMount() {
    let paramsURL = this.props.location.search.substr(1).split("=")

    // this.checkIfCatsubcatExists(paramsURL[1])

    if (paramsURL[0] == "sexe") {
      this.defaultValueSexe(paramsURL[1])

      axios
        .get("http://localhost:8000/api/subcategory/")
        .then((res) => {
          console.log(res.data);
          this.setState({ subcategories: res.data, isSubCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
  
      axios
        .get("http://localhost:8000/api/category/")
        .then((res) => {
          console.log(res.data.data);
          this.setState({ categories: res.data.data, isCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
    }

    if (paramsURL[0] == "name") {
      this.defaultValueName(paramsURL[1])

      axios
        .get("http://localhost:8000/api/subcategory/")
        .then((res) => {
          console.log(res.data);
          this.setState({ subcategories: res.data, isSubCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
  
      axios
        .get("http://localhost:8000/api/category/")
        .then((res) => {
          console.log(res.data.data);
          this.setState({ categories: res.data.data, isCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
    }

    else if (paramsURL[0] == "subcategory") {
      this.defaultValueSubCategory(paramsURL[1])
      console.log(paramsURL[1])

      // axios
      //   .get("http://localhost:8000/api/subcategory/")
      //   .then(async (res) => {
      //     console.log(res.data);

      //     await res.data.map( async subcat => {
      //       // console.log(subcat)
      //       if ( this.state.subcategory == subcat.name ) {
      //         await this.setState({ 
      //           subcategories: [{id: subcat.id, name: subcat.name}], 
      //           category: subcat.Category.name
      //           // categories: [{name: subcat.Category.name, id: subcat.Category.id 
      //           });
      //       }
      //     })
      //   })
      //   .catch((error) => {
      //     console.log(error.response);
      //   });

      // axios
      //   .get("http://localhost:8000/api/category/")
      //   .then(async (res) => {
      //     console.log(res.data.data);
      //     await this.setState({ categories: res.data.data, isCategoryReady: true });

      //     this.setState({isSubCategoryReady: true })
      //   })
      //   .catch((error) => {
      //     console.log(error.response);
      //   });

        // this.handleSubmit()

    }

    else if (paramsURL[0] == "category") {
      this.defaultValueCategory(paramsURL[1])
      
      axios
      .get("http://localhost:8000/api/category/")
      .then(async (res) => {
        console.log(res.data.data);
        await this.setState({ categories: res.data.data, isCategoryReady: true });

        res.data.data.map(cat => {
          if ( this.state.category == cat.name ) {
            this.setState({ subcategories: cat.subCategories, isSubCategoryReady: true });
          }
        })
      })
      .catch((error) => {
        console.log(error.response);
      });
    }
    else {
      axios
        .get("http://localhost:8000/api/subcategory/")
        .then((res) => {
          console.log(res.data);
          this.setState({ subcategories: res.data, isSubCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
  
      axios
        .get("http://localhost:8000/api/category/")
        .then((res) => {
          console.log(res.data.data);
          this.setState({ categories: res.data.data, isCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
    }




    axios
      .get("http://localhost:8000/api/color/")
      .then((res) => {
        console.log(res.data);
        this.setState({ colors: res.data, isColorsReady: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async defaultValueSubCategory(value) {
    this.setState({ subcategory: value });

    await axios
      .get("http://localhost:8000/api/subcategory/")
      .then( (res) => {
        console.log(res.data);

        res.data.map(  subcat => {
          // console.log(subcat)
          if ( this.state.subcategory == subcat.name ) {
            this.setState({ 
              subcategories: [{id: subcat.id, name: subcat.name}], 
              category: subcat.Category.name
              // categories: [{name: subcat.Category.name, id: subcat.Category.id 
              });
          }
        })
      })
      .catch((error) => {
        console.log(error.response);
      });

    axios
      .get("http://localhost:8000/api/category/")
      .then(async (res) => {
        console.log(res.data.data);
        await this.setState({ categories: res.data.data, isCategoryReady: true });

        this.setState({isSubCategoryReady: true })
      })
      .catch((error) => {
        console.log(error.response);
      });

      this.handleSubmit()
  }

  async defaultValueCategory(value) {
    await this.setState({ category: value });
    this.handleSubmit()
  }

  async defaultValueSexe(value) {
    await this.setState({sexe: value})
    this.handleSubmit();
  }

  async defaultValueName(value) {
    await this.setState({searchValue: value})
    $('#inputSearchName').val(value);
    this.handleSubmit();
  }

  

  render() {
    const isCategoryReady = this.state.isCategoryReady
    const isColorReady = this.state.isColorsReady;
    const isSubCategoriesReady = this.state.isSubCategoryReady;

    const sortChecked = this.state.sortBy;
    const results = this.state.results;

    const justArrived = this.state.justArrived;

    return (
      <>
        <div
          className={this.state.showFilter ? "to-right" : justArrived ? "d-none" : "to-left" }
          id="filter-div"
        >
          {/* Price */}
          <div className="form-group d-block">
            <label htmlFor="formControlRange" className="filter-label">Price</label>
            <br />
            
            <div className="f-slider-val f-border">
              <span>
                {this.state.sliderCurrentValue[0]+ " €"}
              </span>
              <span className="float-right">
                {this.state.sliderCurrentValue[1]+ " €"}
              </span>
            </div>
            <ReactBootstrapSlider
              value={this.state.sliderCurrentValue}
              change={this.sliderChangeValue}
              step={this.state.sliderStep}
              max={this.state.sliderMax}
              min={this.state.sliderMin}
              range={true}
              className="f-border"
              id="slider"
            />
          </div>

          {/* Gender */}
          <div className="form-group f-gender">
            <span className="filter-label">Gender</span><br/>
            <div className="form-check f-border mr-5">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  name="optradio"
                  value="H"
                  onChange={this.handleSexe}
                  checked={this.state.sexe == 'H' ? true : false}
                />
                Men
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  name="optradio"
                  value="F"
                  onChange={this.handleSexe}
                  checked={this.state.sexe == 'F' ? true : false}
                />
                Women
              </label>
            </div>
          </div>

          {/* Size */}
          <div className="form-group ">
            <span className="filter-label">Size</span><br/>
            <div className="form-check form-check-inline f-border">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-xs"
                value="xs"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-xs">
                XS
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-s"
                value="s"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-s">
                S
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-m"
                value="m"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-m">
                M
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-l"
                value="l"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-l">
                L
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-xl"
                value="xl"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-xl">
                XL
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-xxl"
                value="xxl"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-xxl">
                XXL
              </label>
            </div>
          </div>

          {/* Color */}
          <div className="form-group ">
            <span className="filter-label">Color</span><br/>

            {isColorReady
                ? this.state.colors.map((color) => (
                  <div className="form-check form-check-inline f-border" key={color.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={color.id}
                      value={color.name.toLowerCase()}
                      onChange={this.handleColor}
                    />
                    <label className="form-check-label" htmlFor={color.id}>
                      {color.name}
                    </label>
                  </div>
                  ))
                : null
            }
          </div>

          {/* Category */}
          <div className="form-group ">
            <label htmlFor="sel1 col-2">
              <span className="filter-label">Category</span>
            </label>

            <select
              className="col-10 form-control f-border"
              id="sel1"
              onChange={this.handleCategory}
            >
              
              <option defaultValue="null"></option>

              {isCategoryReady
                ? 
                this.state.categories.map((category) => (
                  <option key={category.id} value={category.name} >
                    {category.name}
                  </option>
                ))                    
                : null}
            </select>
          </div>

          {/* Subcategory */}
          <div className="form-group">
            <label htmlFor="sel1 col-2">
              <span className="filter-label">Subcategory</span>
            </label>

            <select
              className="col-10 form-control f-border f-select"
              id="sel1"
              onChange={this.handleSubCategory}
            >

              <option value={null}></option>

              {isSubCategoriesReady
                ? 
                this.state.subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.name} >
                    {subcategory.name}
                  </option>
                ))                    
                : null}
            </select>
          </div>

          {/* Search button w/ filters */}
          {/* <div className="">
            <button
              type="submit"
              className="btn btn-dark"
            >
              Search with filters
            </button>
          </div> */}
        </div>
            

        <div className="container">
          <ToastContainer />


          <form className="form-group justify-content-center" >
            
            {/* SEARCH BAR */}
            <div className="form-group row justify-content-center">
              <input
                type="search"
                placeholder="Search a product"
                className="form-control col-8"
                onChange={this.handleName}
                id="inputSearchName"
              ></input>
              <button type="submit" className="btn btn-dark col-1 mt-0 ml-2 p-0" onClick={this.handleSubmit}>
                Search
              </button>
              <span
                className="small mt-auto mb-auto ml-3 text-secondary col-2"
                id="filter-link"
                onClick={this.showFilter}
                aria-controls="filter-div"
                aria-expanded={this.state.showFilter}
                >
                {this.state.showFilter ? "Hide Filters" : "Show Filters"}
              </span>
            </div>

            {/* SORT/ORDER BY */}
            <div className="row float-right mt-2">
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="secondary"
                  name="radio"
                  value="asc"
                  checked={sortChecked == "asc"}
                  onChange={this.handleSortBy}
                >
                  ASC
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="secondary"
                  name="radio"
                  value="desc"
                  checked={sortChecked == "desc"}
                  onChange={this.handleSortBy}
                >
                  DESC
                </ToggleButton>
              </ButtonGroup>

              <Dropdown>
                <span className="ml-5 mr-2">Order by</span>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {this.state.orderBy}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.handleOrderBy}>
                    Popularity
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleOrderBy}>
                    Price
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleOrderBy}>Name</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </form>

          {this.state.isResultsReady 
            ? <Results results={results} />
            : null}
        </div>
      </>
    );
  }
}
