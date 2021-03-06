import { useState, useEffect, useRef } from 'react';
import { TransitionGroup, CSSTransition  } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1541);
    const [charEnded, setCharEnded] = useState(false);

    
    const {loading, error, getAllCharacters} = useMarvelService();


    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        getAllCharacters(offset)
            .then(onCharListLoaded)
                
    }


    const onCharListLoaded =  (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));

        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();

    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            const imgStyle = (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') 
                    ? {'objectFit' : 'unset'} 
                    : {'objectFit' : 'cover'};
        

                return (
                   <CSSTransition key={item.id} timeout={500} classNames="char__item">
                        <li 
                            tabIndex={0}
                            className="char__item"
                            key={item.id}
                            ref={el => itemRefs.current[i] = el}
                            onClick={() => {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }}
                            onKeyPress={() => {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }}
            
                        >
                            <img src={item.thumbnail} alt={item.name}
                            style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                        </li>
                   </CSSTransition>
                )
        })

        return (
            <TransitionGroup component={'ul'}  className="char__grid">
                {items}
            </TransitionGroup>
        )
    }


    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

export default CharList;