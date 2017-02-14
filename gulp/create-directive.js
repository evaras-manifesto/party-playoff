const ejs = require('ejs');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = {
    create: (name) => {
        const data = {
            name: _.kebabCase(name),
            nameCamel: _.camelCase(name)
        };

        const files = {
            html: ejs.render(html, data),
            scss: ejs.render(scss, data),
            js: ejs.render(js, data),
        };

        const dir = path.resolve(__dirname, `../src/components/directives/${data.name}`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFile(`${dir}/${data.name}.html`, files.html, (err) => {
            if (err) return console.log(err);
            console.log("The html file was created!");
        });

        fs.writeFile(`${dir}/${data.name}.scss`, files.scss, (err) => {
            if (err) return console.log(err);
            console.log("The scss file was created!");
        });

        fs.writeFile(`${dir}/${data.name}.js`, files.js, (err) => {
            if (err) return console.log(err);
            console.log("The js file was created!");
        });
    }
};


const html = `<div class="<%=name%>">

</div>`;

const js = `app.component('<%=nameCamel%>Component', {
    templateUrl: '<%=name%>.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: class <%=nameCamel%>Component {

        constructor() {}
        
        $onInit() {
          console.log(<%=nameCamel%>Component);
        }
    }
});`;

const scss = `<%=name%>-component {
  .<%=name%> {

  }
}`;