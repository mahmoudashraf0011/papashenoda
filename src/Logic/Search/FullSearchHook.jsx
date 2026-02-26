import React, { useEffect, useRef, useState } from 'react'
import baseURL from '../../API/baseURL';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, json } from 'react-router-dom';
import { getFullSearchResultAction } from '../../redux/actions/Search/SearchActions';

const FullSearchHook = (closeSearch) => {
    let defaultData={};
    if(localStorage.getItem("allFilter")){
        defaultData=JSON.parse(localStorage.getItem("allFilter"))

    }
    let defaultCates=JSON.parse(localStorage.getItem("selectedCates"))

    const [searchWord,setSearchWord]=useState(defaultData.searchWord?defaultData.searchWord:"");
    const queryStr = String(defaultData.queryStringOfCates || "");  // force it to a string
    const cateIds = (queryStr.match(/category_ids\[\]=(\d+)/g) || [])
      .map(str => str.split("=")[1]);
  
  const mediaIds = (defaultData.queryStringMedia?.match(/media_type_ids\[\]=(\d+)/g) || [])
    .map(str => str.split("=")[1]);
    const [cates,setCates]=useState([]);
    const [active, setActive] = useState("all");
    const [checkedCategories, setCheckedCategories] = useState(mediaIds?mediaIds:[]);
    const ele=useRef();
    const [selected, setSelected] = useState([]);
    const [searchValue, setSearchValue] = useState(defaultData.searchValue?defaultData.searchValue:"");
    const [selectedMedia, setSelectedMedia] = useState(defaultCates?defaultCates:[]);

    useEffect(() => {

        axios.get(`https://popeshenoudatest.msol.dev/api/categories/get/all?lang=ar`)
            .then((response) => {
                setCates(response.data.data);
          
            })
            .catch((error) => {
                console.log(error);
            })



    }, []);


    /* search words */
    const getSearchWord=(e)=>{
        setSearchWord(e.target.value)
        saveData();

    }
    const handleRecentClick = (word) => {
        setSearchWord(word);
        getSearchWord({ target: { value: word } }); // if getSearchWord handles input change
        saveData();

      };


      /*** Categories */
      let catesID =  [];

       let defaultCategories = [];
      

      if (cateIds) {
        defaultCategories.push(
          cateIds.map(id => `category_ids[]=${id}`).join("&")
        );
      }

      const [queryStringOfCates, setQueryStringOfCates] = useState(defaultCates?defaultCategories:"");
      const getCatesIDs = (id) => {

        if (!catesID.includes(id)) {
          catesID.push(id);

        }
      
        const colonSeparated = catesID.join(":");
        
        let arryOfcolonSeparated=colonSeparated.split(",");

        console.log("arryOfcolonSeparated/ثىلفا",arryOfcolonSeparated.length);
        console.log("arryOfcolonSeparated",arryOfcolonSeparated);
        // ✅ Create correct query string format
        if(arryOfcolonSeparated.length <2 &&arryOfcolonSeparated[0]=='' ){
          setQueryStringOfCates("");
        }else{
          setQueryStringOfCates(arryOfcolonSeparated.map(id => `category_ids[]=${id}`).join("&"));

        }
      
        // Store if needed
        localStorage.setItem("selectedCategoryIds", colonSeparated);
        localStorage.setItem("queryCategoryIds", queryStringOfCates);
      };

      let defaultMedia = "";

      if (mediaIds && !mediaIds.includes("0")) {
        defaultMedia = mediaIds
          .map(id => `media_type_ids[]=${id}`)
          .join("&");
      }

      const [queryStringMedia, setQueryStringMedia] = useState(defaultMedia?defaultMedia:"");
      // media 
      const generateMediaTypeQuery = (idsArray) => {
      
      
        if (!idsArray.includes("0")) {
            setQueryStringMedia ( idsArray
            .map(id => `media_type_ids[]=${id}`)
            .join("&")
            )
        }else{
          setQueryStringMedia("")
        }
      
        localStorage.setItem("mediaTypeQuery", queryStringMedia);
      };

      const toggleMedia = (key) => {
        let updated;
      
        if(checkedCategories){
          if (checkedCategories.includes(key)) {
            updated = checkedCategories.filter((item) => item !== key);
          } else {
            updated = [...checkedCategories, key];
          }
        }
     
      
        setCheckedCategories(updated);
        generateMediaTypeQuery(updated); 
        // ✅ Call string generator here
        console.log("generateMediaTypeQuery",updated);
      };

      
    

      /******************************************* search key word prefered */

    // serach key words prefered

  
    const toggleOption = (option) => {
      if (selected.includes(option)) {
        setSelected(selected.filter((item) => item !== option));
      } else {
        setSelected([...selected, option]);
      }
    };
  
    const removeTag = (option) => {
      setSelected(selected.filter((item) => item !== option));
    };   
    const[prefered,setPrefered]=useState([])

    useEffect(() => {

        axios.get(`https://popeshenoudatest.msol.dev/api/preferred/key/words`)
            .then((response) => {
                setPrefered(response.data.data);
          
            })
            .catch((error) => {
                console.log(error);
            })



    }, []);

    function filterOptions(value) {
        const options = document.querySelectorAll('.select-option-search');
        const search = value.trim().toLowerCase();
    
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.classList.toggle('hidden', !text.includes(search));
        });
        }


    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        filterOptions(value);
    };




    const [loading,setLoading]=useState(true);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [recentlyWords, setRecentlyWords] = useState(() => {
      return JSON.parse(localStorage.getItem("recentlyWords")) || [];
    });
    let searchValues=[];

    const vaildSearch = () => {
      const trimmedSearch = searchWord.trim();
    
      if (trimmedSearch.length < 3) {
        alert("The keyword must be at least 3 non-space characters.");
        return false;
      }
    
      return true;
    };
    const saveData=()=>{
      let allFilter={
        "searchWord":searchWord,
        "queryStringOfCates":queryStringOfCates,
        "queryStringMedia":queryStringMedia,
        "searchValue":searchValue

    }



    localStorage.setItem("allFilter",JSON.stringify(allFilter))
    }
    const res=useSelector(state=> state.SearchReducer.searchFullResult);

    const onSubmitSearch = async () => {
      if (!vaildSearch()) return;
      setLoading(true);
    
      const safeSearchWord = searchWord ? `search=${searchWord}&` : "";
      const safeQueryStringOfCates = queryStringOfCates ? queryStringOfCates + "&" : "";
      const safeQueryStringMedia = queryStringMedia ? queryStringMedia + "&" : "";
      const safeSearchValue = searchValue ? `key_words[]=${searchValue}` : "";
    
      const query = `${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`;
      await dispatch(getFullSearchResultAction(query)); // just dispatch
    
      setLoading(false);

    }
    const removeRecentItem = (wordToRemove) => {
      const updatedWords = recentlyWords.filter(word => word !== wordToRemove);
      setRecentlyWords(updatedWords);
      localStorage.setItem("recentlyWords", JSON.stringify(updatedWords));
    };

    // const [allData,setAllData]=useState([]);
    let allData=[];
    let check=false;
    let count;
    useEffect(()=>{
      saveData();
    },[searchWord,queryStringOfCates,queryStringMedia,searchValue])
    
    useEffect(() => {
      if (!res ) return;

      if(loading==false){
    
        if (res.data) {
          localStorage.setItem("allData", JSON.stringify(res.data));
        }
      
        if (res.addetionals?.general_count) {
          localStorage.setItem("searchCount", res.addetionals.general_count);
          localStorage.setItem("searchValue", searchWord); // ← Make sure searchWord is in scope
        }
      
        // Save recently searched words
        if (searchWord) {
          let searchValues = JSON.parse(localStorage.getItem("recentlyWords")) || [];
          searchValues = searchValues.filter(word => word !== searchWord);
          searchValues.unshift(searchWord);
          searchValues = searchValues.slice(0, 4);
          localStorage.setItem("recentlyWords", JSON.stringify(searchValues));
        }
        setTimeout(() => {
          closeSearch();
        }, 110);

        setTimeout(() => {
          window.open("/search", "_blank");
        }, 100);

        setLoading(true)
      }

  
    }, [loading]);
    const restSearch=()=>{
        localStorage.removeItem("allFilter");
        localStorage.removeItem("selectedCates");
        localStorage.removeItem("allData");
        localStorage.removeItem("searchCount");
        setSearchWord("");
        setCheckedCategories([]);
        setSelectedMedia([]);
        setSearchValue("");

    }
    const clearSearch = () => {
      setSearchValue("");
      filterOptions(""); // show all
      // saveData();

  };
  return [searchWord,cates,checkedCategories,prefered,searchValue,setSearchWord,getSearchWord,handleRecentClick,getCatesIDs,filterOptions,toggleMedia,generateMediaTypeQuery,setSearchValue,handleSearchChange,clearSearch,onSubmitSearch,allData,check,count,ele,defaultCates,selectedMedia,setSelectedMedia,restSearch,removeRecentItem]
}

export default FullSearchHook
