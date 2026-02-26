
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getFullSearchMoreResultAction, getFullSearchMoreResultFilterAction, getFullSearchResultAction, getSearchResultMoreAction } from '../../redux/actions/Search/SearchActions';
export default function SearchMoreHook(word,id) {
    const dispatch=useDispatch();
    const [activePage,setActivePage]=useState();
    const [loading, setLoading] = useState(true);
    let defaultData={};
    if(localStorage.getItem("allFilter")){
        defaultData=JSON.parse(localStorage.getItem("allFilter"))

    }

    const safeSearchWord = defaultData.searchWord ? `search=${defaultData.searchWord}&` : "";
    const safeQueryStringOfCates =defaultData.queryStringOfCates ?defaultData.queryStringOfCates + "&": "";
    const safeQueryStringMedia = defaultData.queryStringMedia ?defaultData.queryStringMedia + "&"  :  "";
    const safeSearchValue = defaultData.searchValue ? `key_words[]=${defaultData.searchValue}&` : ""; 
    const fullSearch=`media_type_slug=${id}&page=${1}&per_page=${8}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`
const getData=async()=>{
    const cateID = JSON.parse(localStorage.getItem("filterSearch"));
    const fullSearch=`media_type_slug=${id}&page=${1}&per_page=${8}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`

    if(id=="documents" || id=="pictures-and-sayings"){
        if (localStorage.getItem("filterSearch")) {
            const fullSearchWithCate=`media_type_slug=${id}&page=${1}&per_page=${8}&category_ids[]=${cateID.id}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`

            await dispatch(getFullSearchMoreResultFilterAction(fullSearchWithCate))
          
        } else {
            setLoading(true);
            await dispatch(getFullSearchMoreResultAction(fullSearch));
            setLoading(false);

        }
    }else{
        const cateID = JSON.parse(localStorage.getItem("filterSearch"));
        const fullSearch=`media_type_slug=${id}&page=${1}&per_page=${6}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`
        if (localStorage.getItem("filterSearch")) {
            const fullSearchWithCate=`media_type_slug=${id}&page=${1}&per_page=${6}&category_ids[]=${cateID.id}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`
            setLoading(true);
            await dispatch(getFullSearchMoreResultFilterAction(fullSearchWithCate))
            setLoading(false);

        } else {
            setLoading(true);
            await dispatch(getFullSearchMoreResultAction(fullSearch));
            setLoading(false);

        }

    }


}
useEffect(()=>{
    getData();
    
},[localStorage.getItem("filterSearch")])
let res,resFilter;
     res=useSelector(state=> state.SearchReducer.searchFullMoreResult);
     resFilter=useSelector(state=> state.SearchReducer.searchFullResultMoreFilter);

     




const handleChangePage= async(count)=>{
    const cateID = JSON.parse(localStorage.getItem("filterSearch"));
    const fullSearch=`media_type_slug=${id}&page=${count}&per_page=${8}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`
    setActivePage(count)
    if(id=="documents" || id=="pictures-and-sayings"){
        if (localStorage.getItem("filterSearch")) {
            const fullSearchWithCate=`media_type_slug=${id}&page=${count}&per_page=${8}&category_ids[]=${cateID.id}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`
            setLoading(true);
            await dispatch(getFullSearchMoreResultFilterAction(fullSearchWithCate))
            setLoading(false);

          
        } else {
            setLoading(true);
            await dispatch(getFullSearchMoreResultAction(fullSearch));
            setLoading(false);

        }
    }else{
        const cateID = JSON.parse(localStorage.getItem("filterSearch"));
        const fullSearch=`media_type_slug=${id}&page=${count}&per_page=${6}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`
    
        if (localStorage.getItem("filterSearch")) {  
            const fullSearchWithCate=`media_type_slug=${id}&page=${count}&per_page=${6}&category_ids[]=${cateID.id}&${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`

            setLoading(true);
            await dispatch(getFullSearchMoreResultFilterAction(fullSearchWithCate))
            setLoading(false);

          
        } else {
            setLoading(true);
            await dispatch(getFullSearchMoreResultAction(fullSearch));
            setLoading(false);

        }

    }

 
    window.history.replaceState(null, null, ' ')
    window.scrollTo(0, 0); 

}

let searchMoreData=[];
let currentPage;

try {
    if(localStorage.getItem("filterSearch")){
        if(resFilter){
            if(resFilter.data){
                searchMoreData.push(resFilter.data)

            }
            if(resFilter.pagination){
                currentPage=resFilter.pagination.current_page

            }
        
    }
    }else{
        if(res){
            if(res.data){
                searchMoreData.push(res.data)

            }

            if(res.pagination){
                currentPage=res.pagination.current_page

            }
        }
}
} catch (e) {
    console.log(e);
}

let pageCount=0;

try {
    if(localStorage.getItem("filterSearch")){
        if(resFilter){
            if(resFilter.pagination){
                pageCount=resFilter.pagination.total_pages
            }
        }

    }else{
        if(res){
            if(res.pagination){
                pageCount=res.pagination.total_pages


                
            }
        }
    }
 
} catch (error) {}

return [searchMoreData,pageCount,handleChangePage,getData,activePage,loading,currentPage]
}


