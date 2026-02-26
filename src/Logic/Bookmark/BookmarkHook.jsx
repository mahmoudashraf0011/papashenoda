
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteBookMarkAction, getBookMarkDataAction, getOneBookMarkDataAction } from '../../redux/actions/Profile/BookmarkActions';
import { faL } from '@fortawesome/free-solid-svg-icons';
export default function BookmarkHook() {
    const dispatch=useDispatch();
    const [loading,setLoading]=useState(true);
    const [loadingFav,setLoadingFav]=useState(true);
    const [videosFavData, setVideosFavData] = useState([]);
    const [soundsFavData, setSoundsFavData] = useState([]);
    const [conuted, setCounted] = useState('');
    const headFav=useRef();
    const headOneFav=useRef();
    const ele=useRef();
    let check=false;


const getHeaders = async () => {
  await dispatch(getBookMarkDataAction());
};


useEffect(()=>{
    getHeaders();

},[])


const res=useSelector(state=> state.BookmarkReducer.bookmarkData);


let data=[]
try {
    if(res){
        if(res.data){
            if(res.data.length==0){
                setTimeout(() => {
                check=false
                if(ele.current){
                    ele.current.style.display="block"   
                }
                }, 1000);
                check=true
               }else{
                check=true
                if(ele.current){
                    ele.current.style.display="none"   
                }

               }  
            data=[...res.data]
   
        }

    }
} catch (e) {
    console.log(e);
}

const [fav, setFav] = useState(data?data[0]&&data[0].id:null);


const resOne=useSelector(state=> state.BookmarkReducer.oneBookmarkData);


const handleChooseFav = async (id) => {
    setSoundsFavData([]);
    setVideosFavData([]);
    setLoadingFav(true);
    setFav(id)
    if(id==5){
        await dispatch(getOneBookMarkDataAction(id, 10, 1));
    }else{
        await dispatch(getOneBookMarkDataAction(id, 6, 1));

    }
    setLoadingFav(false);

}

const [pageCount, setPageCount] = useState(0);
// useEffect(()=>{
//     handleChooseFav()
// },[])
useEffect(()=>{
    if(loadingFav==false){
        if (resOne) {
            if(resOne.bookmarks){
                if (fav === 5) {
                    
                    setSoundsFavData(resOne.bookmarks);
                    if(res.data){
                        if(headFav.current){
                            if(headFav.current.children){
                                for (let item of headFav.current.children) {
                                    item.classList.remove("activeB");
                                }
                                for (let item of headFav.current.children) {
                                   if(item.id=="fav5"){
                                    item.classList.add("activeB");
                                   }
                                }
                                
                            }
                            }
                
                    }
    
              
                }
                if (fav === 3) {
                    setVideosFavData(resOne.bookmarks);
                    if(res.data){
                        if(headFav.current){
                            if(headFav.current.children){
                                for (let item of headFav.current.children) {
                                    item.classList.remove("activeB");
                                }
                                for (let item of headFav.current.children) {
                                    if(item.id=="fav3"){
                                     item.classList.add("activeB");
                                    }
                                 }
                                
                            }
                            }
                
                    }           
                    
                }
            }

            if(resOne.pagination){
                setPageCount(Math.ceil(resOne.pagination.totalPages))
       
       }
         
        }

        setLoadingFav(true)
    }


   
},[loadingFav])






const handleChangePage =  async(count) => {
    setCounted(count)

    if (pageCount > 10 || count < 0) {
        return;}
        setLoadingFav(true);
        if(fav==5){
            await dispatch(getOneBookMarkDataAction(fav,10, count));

        }else{
            await dispatch(getOneBookMarkDataAction(fav,6, count));

        }
        setLoadingFav(false);
  


}



const handleDeleteFav=async (idDelete)=>{
    setLoading(true)
    await dispatch(deleteBookMarkAction(idDelete))
    if(resOne.bookmarks)
    {
        if(resOne.bookmarks.length != 1){
            setLoadingFav(true);
            if(fav==5){
                await dispatch(getOneBookMarkDataAction(fav,10, conuted));
    
            }else{
                await dispatch(getOneBookMarkDataAction(fav,6, conuted));
    
            }
             setLoadingFav(false); 
        }else{
            handleChooseFav(fav);
        }
    }

  
    setLoading(false)

}
const resDelete=useSelector(state=> state.BookmarkReducer.deleteBookmark);

useEffect(()=>{
    if(loading==false){

        if(resDelete){
            if(resDelete.status==200){
                  
                }
        setLoading(true)
    }
    }
    },[loading])
return [data,videosFavData,soundsFavData,pageCount,handleChangePage,handleDeleteFav,handleChooseFav,getHeaders,headFav,fav,ele,check]
}
