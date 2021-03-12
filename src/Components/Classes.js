import React,{ Component } from 'react';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

class Classes extends Component {
    constructor(props){
        super(props);
        this.state={
            files:[],
            courses:[]
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
    render(){
        const {courses} =this.state
        return (
            <div className="all container">
                <p>Classes</p>
                <ToastContainer draggable={false} autoClose={3000}/>
                <div className="upload" className="row mb-3 align-items-center justify-content-center">
                    <div className="col-sm-3 mr-auto">
                        <button className="btn-lg" onClick={this.downloader}>Downloader</button>
                    </div>
                    <div className="col-sm-4 mt-1">
                        <input type="file" name="courses" id="courses" onChange={this.fileChanger}/>
                    </div>
                    <div className="col-sm-3 ml-auto mt-1" >
                        <button onClick={this.fileUploader} className="btn-lg">Upload</button>
                    </div>
                </div>
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
                                        <tr>
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
