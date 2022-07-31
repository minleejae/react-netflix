import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useDebounce } from "../../hooks/useDebounce";
import "./SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();

  const [searchResulsts, setSearchResults] = useState([]);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  const searchTerm = query.get("q");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchMovie(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchSearchMovie = async (debouncedSearchTerm) => {
    try {
      const request = await axios.get(
        `/search/multi?include_adult=false&query=${debouncedSearchTerm}`
      );
      setSearchResults(request.data.results);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(debouncedSearchTerm);

  const renderSearchResults = () => {
    return searchResulsts.length > 0 ? (
      <section className="search-container">
        {searchResulsts.map((movie) => {
          if (movie.backdrop_path !== null && movie.media_type !== "person") {
            const moveImageUrl =
              "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
            return (
              <div
                className="movie"
                key={movie.id}
                onClick={() => navigate(`/${movie.id}`)}
              >
                <div className="movie__colum-poster">
                  <img
                    src={moveImageUrl}
                    alt="movie"
                    className="movie__poster"
                  />
                </div>
              </div>
            );
          }
        })}
        ()
      </section>
    ) : (
      <section className="no-results">
        <div className="no-results__text">
          <p>
            찾고자하는 검색어 "{debouncedSearchTerm}"에 맞는 영화가 없습니다.
          </p>
        </div>
      </section>
    );
  };

  console.log("render::", renderSearchResults());
  return renderSearchResults();
}
