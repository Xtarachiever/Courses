import React,{ Component } from 'react';
import {ToastContainer,toast} from 'react-toastify';
import { Nav, Navbar, NavbarToggler, Collapse, NavbarBrand, NavItem } from 'reactstrap';
import '../App.css'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

class Classes extends Component {
    constructor(props){
        super(props);
        this.state={
            files:[],
            courses:[],
            isNavOpen:false
        }
    }
    fileChanger=async (e)=>{
        const files=e.target.files[0];
        this.setState({
            files:files
        })
    }
    downloader=()=>{
        axios({
          url:'https://room4010-bulk-insert.herokuapp.com/api/v1/courses/sample-courses-file',
          method:'GET',
          responseType:"blob",
        }).then((response)=>{
          const url=window.URL.createObjectURL(new Blob([response.data]));
          const link=document.createElement('a');
          link.href=url;
          link.setAttribute('download','file.xlsx');
          document.body.appendChild(link);
          link.click();
        });
      }
    fileUploader=()=>{
        const fileY=this.state.files;
        let data=new FormData();
        data.append('courses',fileY);
        fetch('//room4010-bulk-insert.herokuapp.com/api/v1/courses/create-many',{
          method:'POST',
          body:data,
        })
        .then(res=>res.json())
        .then((data)=>{
            console.log(data)
            const resHasData=data.hasOwnProperty('data')
            if(resHasData){
                const dataHolder=data.data;
                const createdData=dataHolder.newCourses;
                const successData=data.success;
                this.setState({
                    courses:createdData
                })
                if(successData){
                    console.log(true)
                    toast(data.success)
                    toast(data.message,{
                      className:"custom-toast",
                      draggable:true,
                      type:'success',
                      position:toast.POSITION.TOP_RIGHT
                    })
                }

                else{
                    toast(data.success)
                    toast(data.message,{
                      className:"error-toast",
                      draggable:true,
                      type:'error',
                      position:toast.POSITION.TOP_RIGHT
                    })
                }
            }
            else{
                this.setState({
                    courses:[]
                })
                toast(data.message,{
                  className:"error-toast",
                  draggable:true,
                  type:'error',
                  position:toast.POSITION.TOP_RIGHT
                })
            }

        })
    }
    toggleNav=()=>{
        this.setState({
            isNavOpen:!this.state.isNavOpen
        });
    }
    render(){
        const {courses} =this.state
        return (
            <div className="all container align-items-center justify-content-center">
                <ToastContainer draggable={false} autoClose={3000}/>
                    <Navbar dark expand="md" className="main">
                        <div className="container">
                            <NavbarBrand className="mr-auto"><p style={{color:'black'}}>Classes</p></NavbarBrand>
                            <NavbarToggler onClick={this.toggleNav} className="bg-dark navbar-dark"/>
                            <Collapse isOpen={this.state.isNavOpen} navbar>
                                <Nav className="nav bg-light navbar-light mt-3 ml-auto">
                                    <NavItem>
                                    <div className="col-sm-3 mr-auto">
                                        <button className="btn-sm" onClick={this.downloader}>Downloader</button>
                                    </div>
                                    </NavItem>
                                    <NavItem>
                                    <div className="col-sm-4">
                                        <input type="file" name="courses" id="courses" onChange={this.fileChanger}/>
                                    </div>
                                    </NavItem>
                                    <NavItem>
                                    <div className="col-sm-3" >
                                        <button onClick={this.fileUploader} className="btn-sm">Upload</button>
                                    </div>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </div>
                    </Navbar>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Major</th>
                                <th>Grade ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                courses.map(course=>{
                                    return(
                                        <tr key={course.id}>
                                            <td>{course.title}</td>
                                            <td>{course.description}</td>
                                            <td>{course.major}</td>
                                            <td>{course.grade_id}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Classes;
