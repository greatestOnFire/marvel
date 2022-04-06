import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=104c95d5c2e676887fa9065f04f9f3e4';
    const _baseOffset = 210;
    const _hash = '2e960385359cc29c2929e43ccba538a9'

   

    const getAllCharacters = async (offset = _baseOffset) => {
       const res = await request(`${_apiBase}characters?ts=1&limit=9&offset=${offset}&${_apiKey}&hash=${_hash}`);
       return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?ts=1&${_apiKey}&hash=${_hash}`);
        return _transformCharacter(res.data.results[0]);
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

    return {loading, error, getAllCharacters, getCharacter, clearError};

}


export default useMarvelService;