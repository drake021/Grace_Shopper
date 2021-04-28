// import React, { useEffect, useState } from 'react';

// const Catalog = () => {
//     const [catalogList, setCatalogList] = useState([]);
//     const [active, setActive] = useState(0);

//     const eventHandler = (e, index) => {
//         e.preventDefault();
//         setActive(index);
//     }

//     const indexCount = (index) => {
//         indexPlus = index + 1;
//         return indexPlus;
//     }


//     useEffect(() => {
//         fetchCatalog().then(items => {
//             setCatalogList(items)
//         })
//             .catch(error => {
//             });
//     }, []);

//     return (

//         <div id="cataloglist">
//             <form>
//                 {catalogList.map(({ id, name, description, price }) => (
//                     <div key={id}>
//                         <h3 >
//                             <button
//                                 onClick={(e) => eventHandler(e, index)}
//                                 className={active === index ? 'active' : 'inactive'}
//                                 aria-expanded={active === index ? 'true' : 'false'}
//                                 aria-controls={'sect-' + indexCount(index)}
//                                 aria-disabled={active === index ? 'true' : 'false'}
//                                 tabIndex={indexCount(index)}
//                             >
//                                 <span className="title-wrapper">{name}
//                                     <span className={ active === index  ? 'plus' : 'minus'}></span>
//                                 </span>  
//                             </button>
//                         </h3 >
//                         <div id={ 'sect-' + indexCount(index) } className={ active === index  ? 'panel-open' : 'panel-close' }>
//                                 { description }
//                                 <h5>Price: {price} </h5>
//                                 <button>Add to Cart</button>
//                         </div>
//                     </div>
//                 ))}
//             </form>
//         </div>
//     );

// }

// export default Catalog;

import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import SearchBar from "material-ui-search-bar";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Image from '../img/background.gif';
import { fetchCatalog } from '../api/index.js';





const useStyles = makeStyles((theme) => ({
    "@global": {
		main: {
      backgroundImage: `url(${Image})`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center center",
			backgroundSize: "cover",
			backgroundAttachment: "fixed",
			height: "100%"
		},
  },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
      },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Catalog = () => {
    const classes = useStyles();
    const [catalogList, setCatalogList] = useState([]);

    useEffect(() => {
        fetchCatalog().then(items => {
            setCatalogList(items)
        })
            .catch(error => {
            });
    }, []);

    console.log(catalogList);

    return (
        <React.Fragment>
            <CssBaseline />
            <main>

                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Card>
                                    <SearchBar
                                        // value={this.state.value}
                                        // onChange={(newValue) => this.setState({ value: newValue })}
                                        // onRequestSearch={() => doSomethingWith(this.state.value)}
                                    />
                                     <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-native-select">Select a Category</InputLabel>
        <Select native defaultValue="" id="grouped-native-select">
          <option aria-label="None" value="" />
            <option value={1}>Category 1</option>
            <option value={2}>Category 2</option>
            <option value={3}>Category 3</option>
            <option value={4}>Cateogry 4</option>
        </Select>
      </FormControl>
    </div>
    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://source.unsplash.com/random"
                                        title="Image title"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Collectible
                    </Typography>
                                        <Typography>
                                            This is where the description of the collectible will go.
                    </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            Add to Cart
                    </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}

export default Catalog;