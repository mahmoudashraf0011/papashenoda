import React, { useRef } from 'react'
import SearchHook from './SearchHook';

export default function SearchContainerHook(data) {

    let categoryBookDataSearch=[];
    let categoryGalleryDataSearch=[];
    let categoryVideoDataSearch=[];
    let categoryArticleDataSearch=[];
    let categorySoundDataSearch=[];
    let categorySayingsDataSearch=[];
    let categoryPhotoSayingsDataSearch=[];
    let categoryPoemsDataSearch=[];
    let categoryQuestionsDataSearch=[];
    let categoryHappenDataSearch=[];
    let categoryDocsDataSearch=[];
    let notFound="لا يوجد نتائج بحث"
    let check=true
    const x=useRef()
        if(data){
            
            console.log("all",data);
            if (Array.isArray(data)) {
                data.map((item)=>{
                    if(item.media_type_id==1){
                        categoryBookDataSearch.push(item)            }
                    if(item.media_type_id==2){
                        categoryGalleryDataSearch.push(item) 
                    }
                    if(item.media_type_id==3){
                        categoryVideoDataSearch.push(item) 
                    }
                    if(item.media_type_id==4){
                        categoryArticleDataSearch.push(item) 
                    }
        
                    if(item.media_type_id==5){
                        categorySoundDataSearch.push(item) 
                    }
                    if(item.media_type_id==8){
                        categorySayingsDataSearch.push(item) 
                    }
                    if(item.media_type_id==10){
                        categoryPhotoSayingsDataSearch.push(item) 
                    }
                    if(item.media_type_id==12){
                        categoryPoemsDataSearch.push(item) 
                    }
                    if(item.media_type_id==14){
                        categoryQuestionsDataSearch.push(item) 
                    }
                    if(item.media_type_id==15){
                        categoryHappenDataSearch.push(item) 
                    }
                    if(item.media_type_id==16){
                        categoryDocsDataSearch.push(item) 
                    }
                   
                })
     
            }

          
   
        }

 
    

  return [categoryBookDataSearch,categoryGalleryDataSearch,categoryVideoDataSearch,categoryArticleDataSearch,categorySoundDataSearch,categorySayingsDataSearch,categoryPhotoSayingsDataSearch,categoryPoemsDataSearch,categoryQuestionsDataSearch,categoryHappenDataSearch,categoryDocsDataSearch,notFound]
}
