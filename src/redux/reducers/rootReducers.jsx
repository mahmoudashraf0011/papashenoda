import { combineReducers } from "redux";

import { AuthReducer } from "./Auth/AuthReducer";
import { HomeReducer } from "./Home/HomeReducer";
import { PoemsReducer } from "./Media/Writings/PoemsReducer";
import { WritingsReducer } from "./Media/Writings/WritingsReducer";
import { SayingsReducer } from "./Media/Writings/SayingsReducer";
import { ArticlesReducer } from "./Media/Writings/ArticlesReducer";
import { HappenReducer } from "./Media/Writings/HappenReducer";
import { QuestionReducer } from "./Media/Writings/QuestionReducer";
import { DocsReducer } from "./Media/Writings/DocsReducer";
import { CategoryReducer } from "./Categories/CategoryReducer";
import { SearchReducer } from "./Search/SearchReducer";
import {ProfileReducer} from "./Profile/ProfileReducer";
import { BookmarkReducer } from "./Profile/BookmarkReducer";
import { RandomQuoteReducer } from "./RandomQuoteReducer";
import { VideosReducer } from "./Media/Videos/VideosReducer";
import { GalleryReducer } from "./Gallery/GalleryReducer";


export default combineReducers({
  AuthReducer:AuthReducer,
  HomeReducer:HomeReducer,
  PoemsReducer:PoemsReducer,
  WritingsReducer:WritingsReducer,
  SayingsReducer:SayingsReducer,
  ArticlesReducer:ArticlesReducer,
  HappenReducer:HappenReducer,
  QuestionReducer:QuestionReducer,
  DocsReducer:DocsReducer,
  CategoryReducer:CategoryReducer,
  SearchReducer:SearchReducer,
  ProfileReducer:ProfileReducer,
  BookmarkReducer:BookmarkReducer,
  RandomQuoteReducer:RandomQuoteReducer,
  VideosReducer:VideosReducer,
  GalleryReducer:GalleryReducer
})