import React, { useState, useEffect } from "react";

export default function UserList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(2);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardAdress, setSelectedCardAdress] = useState(null);
  const [selectedCardCompany, setSelectedCardCompany] = useState(null);
  const [selectedCardFriends, setSelectedCardFriends] = useState([]);
  const [invis, setInvis] = useState(true)

  const loadMoreData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${pageNumber}/20`
      );
      const newData = await response.json();
      setData((prevData) => [...prevData, ...newData.list]);

      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageNumber]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      const response = await fetch(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/1/20`
      );
      const newData = await response.json();
      setData(newData.list);
    }
    fetchData();
  }, []);

const handleScroll = () => {
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const threshold = document.documentElement.offsetHeight - 100;
    
    if (scrollPosition >= threshold && !isLoading) {
      loadMoreData();
    }
  };

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    setSelectedCardAdress(card);
    setSelectedCardCompany(card);
    setInvis(prev => !prev)
    try {
      const response = await fetch(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${card.id}`
      );
      const userData = await response.json();
      setSelectedCard((prevSelectedCard) => ({
        ...prevSelectedCard,
        ...userData,
      }));
      setSelectedCardAdress((prevSelectedCardAdress) => ({
        ...prevSelectedCardAdress,
        ...userData.address,
      }));
      setSelectedCardCompany((prevSelectedCardCompany) => ({
        ...prevSelectedCardCompany,
        ...userData.company,
      }));
      const newResponse = await fetch(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${card.id}/friends/${pageNumber}/25`
      );
      const friendsListData = await newResponse.json();
      setSelectedCardFriends((prevSelectedCardFriends) => [  ...prevSelectedCardFriends,  ...friendsListData.list,]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {selectedCard && (
        <div className="selected-card-container">
          <div className="selected-card">
            <img
              src={`${selectedCard.imageUrl}`}
              alt="cute cat"
              className="selected-card-img"
            />
            <div className="selected-card-info">
              <p className="selected-card-p modifier-bold">
                {selectedCard.prefix +
                  " " +
                  selectedCard.name +
                  " " +
                  selectedCard.lastName}
              </p>
              <p className="selected-card-p modifier-title">
                {selectedCard.title}
              </p>
              <p className="selected-card-p">Email: {selectedCard.email} </p>
              <p className="selected-card-p">Ip Address: {selectedCard.ip}</p>
              <p className="selected-card-p">
                Job Area: {selectedCard.jobArea}
              </p>
              <p className="selected-card-p">
                Job Type: {selectedCard.jobType}
              </p>
            </div>

            <div className="selected-card-address">
              <p className="selected-card-p modifier-bold">
                {selectedCardCompany.name + " " + selectedCardCompany.suffix}
              </p>
              <p className="selected-card-p">City: {selectedCardAdress.city}</p>
              <p className="selected-card-p">
                Country: {selectedCardAdress.country}
              </p>
              <p className="selected-card-p">
                State: {selectedCardAdress.state}
              </p>
              <p className="selected-card-p">
                Street Address: {selectedCardAdress.streetAddress}
              </p>
              <p className="selected-card-p">
                ZIP: {selectedCardAdress.zipCode}
              </p>
            </div>
          </div>
          <h1 className='friends-h1'>Friends: </h1>

          <div className="friends-list">
            {selectedCardFriends.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="card"
                onClick={() => handleCardClick(card)}
              >
                <img
                  src={`${card.imageUrl}`}
                  alt="cute cat"
                  className="card-img"
                />
                <div className="card-text">
                  <p className="card-text-name">
                    {card.prefix + " " + card.name + " " + card.lastName}
                  </p>
                  <p className="card-text-title">{card.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    { invis && <div className="card-wrapper">
        {data.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="card"
            onClick={() => handleCardClick(card)}
          >
            <img src={`${card.imageUrl}`} alt="cute cat" className="card-img" />
            <div className="card-text">
              <p className="card-text-name">
                {card.prefix + " " + card.name + " " + card.lastName}
              </p>
              <p className="card-text-title">{card.title}</p>
            </div>
          </div>
        ))}
        {isLoading && <p className="loading">Loading...</p>}
      </div>}
    </div>
  );
}
