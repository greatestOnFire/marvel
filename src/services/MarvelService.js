import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=104c95d5c2e676887fa9065f04f9f3e4';
    const _baseOffset = 210;
    const _baseComicsOffset = 0;
    const _hash = '2e960385359cc29c2929e43ccba538a9'

   

    const getAllCharacters = async (offset = _baseOffset) => {
       const res = await request(`${_apiBase}characters?ts=1&limit=9&offset=${offset}&${_apiKey}&hash=${_hash}`);
       return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?ts=1&${_apiKey}&hash=${_hash}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _baseComicsOffset) => {
        const res = await request(`${_apiBase}comics?ts=1&orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}&hash=${_hash}`);
       return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?ts=1&${_apiKey}&hash=${_hash}`);
        return _transformComics(res.data.results[0]);
    }

    
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? char.description : 'Описание отсутствует',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }


    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'Описание отсутствует',
            pageCount: comics.pageCount ? comics.pageCount : 'Нет информаций',
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'Цена отсуствует'
        }

    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComics};

}


export default useMarvelService;