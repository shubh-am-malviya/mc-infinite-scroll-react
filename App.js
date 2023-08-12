import React, { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "./InfiniteScroll";

const App = () => {
	const [query, setQuery] = useState("");
	const [listData, setListData] = useState([]);
	const controller = useRef();

	const getData = useCallback((query, pageNumber) => {
		if (controller.current) controller.current.abort();
		controller.current = new AbortController();

		return fetch(
			`https://openlibrary.org/search.json?` +
				new URLSearchParams({ q: query, page: pageNumber }),
			{ signal: controller.current.signal }
		)
			.then((res) => res.json())
			.then((resData) =>
				setListData((prevList) => [...prevList, ...resData.docs])
			)
			.catch((e) => console.log("ERROR: " + e.message));
	}, []);

	const handleInput = useCallback((e) => {
		setQuery(e.target.value);
		if (e.target.value === "") {
			setListData([]);
		}
	}, []);

	return (
		<div style={{ padding: "2rem" }}>
			<input
				type="text"
				placeholder="Search movies..."
				value={query}
				onChange={handleInput}
			/>
			<br />
			<br />
			<InfiniteScroll query={query} listData={listData} getData={getData} />
		</div>
	);
};

export default App;
