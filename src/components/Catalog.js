<<<<<<< HEAD
import React, { useEffect, useState } from 'react';

const Catalog = () => {
    const [catalogList, setCatalogList] = useState([]);
    const [active, setActive] = useState(0);

    const eventHandler = (e, index) => {
        e.preventDefault();
        setActive(index);
    }

    const indexCount = (index) => {
        indexPlus = index + 1;
        return indexPlus;
    }


    useEffect(() => {
        fetchCatalog().then(items => {
            setCatalogList(items)
        })
            .catch(error => {
            });
    }, []);

    return (

        <div id="cataloglist">
            <form>
                {catalogList.map(({ id, name, description, price }) => (
                    <div key={id}>
                        <h3 >
                            <button
                                onClick={(e) => eventHandler(e, index)}
                                className={active === index ? 'active' : 'inactive'}
                                aria-expanded={active === index ? 'true' : 'false'}
                                aria-controls={'sect-' + indexCount(index)}
                                aria-disabled={active === index ? 'true' : 'false'}
                                tabIndex={indexCount(index)}
                            >
                                <span className="title-wrapper">{name}
                                    <span className={ active === index  ? 'plus' : 'minus'}></span>
                                </span>  
                            </button>
                        </h3 >
                        <div id={ 'sect-' + indexCount(index) } className={ active === index  ? 'panel-open' : 'panel-close' }>
                                { description }
                                <h5>Price: {price} </h5>
                                <button>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </form>
        </div>
    );

}
=======
import React, {useState, useHook} from 'react';

const Catalog = () => {

    return <>
        <h1>Catalog</h1>
    </>
};
>>>>>>> af87f2a15cd44b2cc80d0da51e13cadfb8a3d8cf

export default Catalog;