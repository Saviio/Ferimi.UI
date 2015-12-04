import select from '../template/select.html'
import option from '../template/option.html'
import * as helper from '../../utils'
//normal
//search
//multi
//disable
//span + span + ul + li + span
//select overflow ...
//select option group
//single option disable

export class Select {
    constructor(utils){
        this.restrict='EA'
        this.replace=true
        this.template=select
        this.require="^ngModel"
        this.scope={
            ngModel:'='
        }
        this.transclude=true
        this.utils=utils
        this.controller.$inject=['$scope','$timeout']
    }

    controller($scope,$timeout){}

    link(scope,elem,attrs,ctrl){
        let icon = elem.children().children()[1]
        let select = angular.element(elem.children()[0])
        let dropdown = angular.element(elem.children()[1])
        let expanded = false

        let withSearch = null

        scope.withSearch = withSearch = this.utils.DOMState(attrs, 'search')

        if(withSearch){
            let tmpl = `<div><input placeholder="输入"/></div>`
            let searchInput = dropdown.prepend(tmpl).find('input')
            let func = this.utils.debounce(()=>{
                let options = dropdown.find('span')
                let val = searchInput.val()

                let cb1 = (e) => {
                    new RegExp(val,"ig").test(e.innerText)
                    ? e.parentElement.classList.remove('hide')
                    : e.parentElement.classList.add('hide')
                }
                let cb2 = (e) => e.parentElement.classList.remove('hide')

                options::[].forEach(val ? cb1 : cb2)
            },200)

            searchInput.bind('input', ()=> func())
        }


        scope.switchDropdownState = () => {
            expanded = !expanded

            if(expanded){
                icon.classList.add('expanded')
                dropdown.removeClass('select-dropdown-hidden select-dropdown-fadeOut').addClass('select-dropdown-fadeIn')
            } else {
                icon.classList.remove('expanded')
                dropdown.removeClass('select-dropdown-fadeIn').addClass('select-dropdown-fadeOut')
            }

            if(!expanded)
                dropdown::this.utils.onMotionEnd(()=>
                    dropdown.addClass('select-dropdown-hidden'))
        }

        select.bind('click',scope.switchDropdownState)
    }

    passing(exports, $scope){
        exports.select= function(item){
            $scope.$apply(()=>{
                $scope.ngModel = item
                $scope.switchDropdownState()
            })
        }
    }
}

Select.$inject = ['fermi.Utils']

//@value
export class Option {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.require='^fermiSelect'
        this.template=option
        this.transclude=true
        this.scope={
            value:'='
        }
    }

    link(scope,elem,attrs,parentCtrl){
        console.log(helper)
        let a=document.getElementsByTagName('body')[0]
        //window.ele=elem
        if(typeof attrs.value === "string" && scope.value === undefined)
            scope.value = attrs.value

        elem.bind('click', ()=>{
            parentCtrl.select(scope.value)
        })
    }
}
