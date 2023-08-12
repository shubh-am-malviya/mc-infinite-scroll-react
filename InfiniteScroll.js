import React, { useCallback, useEffect, useRef, useState } from "react";

const InfiniteScroll = (props) => {
	const { query, listData, getData } = props;

	const [loading, setLoading] = useState(0);
	const pageNumber = useRef(1);
	const observer = useRef();

	useEffect(() => {
		if (query !== "") {
			fetchData();
		}
	}, [query]);

	const lastElementObeserver = useCallback(
		(node) => {
			console.log("Inside observer");
			if (loading > 0) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					pageNumber.current += 1;
					fetchData();
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading]
	);

	const fetchData = useCallback(() => {
		setLoading((prevLoading) => prevLoading + 1);
		getData(query, pageNumber.current).finally(() => {
			setLoading((prevLoading) => prevLoading - 1);
		});
	}, [query]);

	const getListItemsUI = useCallback(() => {
		return listData.map((movie, index) => {
			if (index === listData.length - 1) {
				return (
					<h3 ref={lastElementObeserver} key={index}>
						{movie.title}
					</h3>
				);
			}
			return <h3 key={index}>{movie.title}</h3>;
		});
	}, [listData]);

	return (
		<div>
			{getListItemsUI()}
			{loading > 0 && <h2>Loading...</h2>}
		</div>
	);
};

export default InfiniteScroll;
