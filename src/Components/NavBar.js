import React  from 'react';

import {
    Navbar,
    NavbarBrand,

} from 'reactstrap';

const NavBar = (props) => {
      return (
        <div >
            <Navbar color="light" light expand="md" id="contenedor-titulo" >
                <NavbarBrand  style={{color: '#ffffff',    fontWeight: '600'}}>TAREAS</NavbarBrand>

            </Navbar>
        </div>
    );
}

export default NavBar;
