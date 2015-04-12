angular.module('angular-buttonbar',[]).directive('buttonBar',[function buttonBar() {
    var adjustSelections = function($scope){
        if(!$scope.dataProvider || !$scope.dataProvider.length){
            $scope.options.selectedItems = [];
            $scope.options.selectedIndices = [];
            return;
        }
        if(!$scope.options.selectedItems)
            $scope.options.selectedItems = [];
        if(!$scope.options.selectedIndices)
            $scope.options.selectedIndices = [];
        if($scope.options.selectedItems.length == $scope.options.selectedIndices.length){
            if($scope.options.selectedItems.length){
                $scope.options.selectedItem = $scope.options.selectedItems[0];
                $scope.options.selectedIndex = $scope.options.selectedIndices[0];
            }  else {
                $scope.options.selectedItem = null;
                $scope.options.selectedIndex = -1;
            }
            return;
        }
        if($scope.options.selectedItems.length){
            $scope.options.selectedIndices = [];
            for(var i in $scope.options.selectedItems){
                var index = $scope.dataProvider.indexOf($scope.options.selectedItems[i]);
                if(index != -1)
                    $scope.options.selectedIndices.push(index);
            }
            $scope.options.selectedItems = [];
            for(var j in $scope.options.selectedIndices)
                $scope.options.selectedItems.push($scope.dataProvider[$scope.options.selectedIndices[j]]);
        } else if($scope.options.selectedIndices.length){
            $scope.options.selectedItems = [];
            for(var i in $scope.options.selectedIndices){
                if($scope.options.selectedIndices[i] >= 0 && $scope.options.selectedIndices[i] < $scope.dataProvider.length)
                    $scope.options.selectedItems.push($scope.dataProvider[$scope.options.selectedIndices[i]]);
            }
            $scope.options.selectedIndices = [];
            for(var j in $scope.options.selectedItems)
                $scope.options.selectedIndices.push($scope.dataProvider.indexOf($scope.options.selectedItems[j]));
        }
        if($scope.options.selectedItems.length){
            $scope.options.selectedItem = $scope.options.selectedItems[0];
            $scope.options.selectedIndex = $scope.options.selectedIndices[0];
        }  else {
            $scope.options.selectedItem = null;
            $scope.options.selectedIndex = -1;
        }

    }

    var link = function($scope, $element, $attrs) {
        if($scope.options.enableMultiSelect) {
            adjustSelections($scope);
        }
        for(var i = 0;$scope.dataProvider && i < $scope.dataProvider.length; i++){
            var data = $scope.dataProvider[i];
            var span = document.createElement("span");
            span.innerHTML = $scope.options.labelFunction ? $scope.options.labelFunction(data) : (typeof data === "object" && $scope.options.labelField ) ? data[$scope.options.labelField] : data;
            span.setAttribute("class", $scope.options.buttonStyleName ? $scope.options.buttonStyleName : "btn btn-default");
            if($scope.options.enableMultiSelect){
                for(var index in $scope.options.selectedItems){
                    if(data == $scope.options.selectedItems[index]){
                        span.setAttribute("class", ($scope.options.buttonStyleName?$scope.options.buttonStyleName:"btn btn-default")+" active");
                        break;
                    }
                }
            } else {
                if(data == $scope.options.selectedItem || i == $scope.options.selectedIndex){
                    span.setAttribute("class", ($scope.options.buttonStyleName?$scope.options.buttonStyleName:"btn btn-default")+" active");
                    $scope.selectedButton = span;
                }
            }
            span.setAttribute("index", i);
            span.style.borderRadius = "0px";
            if(i == 0){
                span.style.borderBottomLeftRadius = "3px";
                span.style.borderTopLeftRadius = "3px";
            }
            if( i == $scope.dataProvider.length - 1){
                span.style.borderBottomRightRadius = "3px";
                span.style.borderTopRightRadius = "3px";
            } else {
                span.style.borderRight = "none";
            }
            $element.append(span);

            angular.element(span).on("click",function(event){
                if($scope.options.enableMultiSelect){
                    var selected = false;
                    if(angular.element(event.currentTarget).hasClass('active'))
                        angular.element(event.currentTarget).removeClass('active')
                    else{
                        angular.element(event.currentTarget).addClass('active')
                        selected = true;
                    }
                    var index = parseInt(event.currentTarget.getAttribute('index'));
                    if(selected){
                        $scope.options.selectedItems.push($scope.dataProvider[index])
                        $scope.options.selectedIndices.push(parseInt(index));
                    } else {
                        if($scope.options.selectedItems.indexOf($scope.dataProvider[index]) != -1 && $scope.options.selectedItems.indexOf($scope.dataProvider[index]) < $scope.options.selectedItems.length)
                            $scope.options.selectedItems.splice($scope.options.selectedItems.indexOf($scope.dataProvider[index]),1);
                        if($scope.options.selectedIndices.indexOf(parseInt(index)) != -1 && $scope.options.selectedIndices.indexOf(parseInt(index)) < $scope.options.selectedIndices.length)
                            $scope.options.selectedIndices.splice($scope.options.selectedIndices.indexOf(parseInt(index)), 1);
                    }
                    adjustSelections($scope);
                    if($scope.options.onChange)
                        $scope.options.onChange(
                            {
                                selectedItem : $scope.options.selectedItem,
                                selectedIndex :  $scope.options.selectedIndex,
                                selectedItems : $scope.options.selectedItems,
                                selectedIndices : $scope.options.selectedIndices
                            }
                        );
                } else {
                    if($scope.options.selectedIndex == event.currentTarget.getAttribute('index')){
                        $scope.options.selectedIndex = -1;
                        $scope.options.selectedItem = null;
                        angular.element(event.currentTarget).removeClass('active');
                        if($scope.options.onChange)
                            $scope.options.onChange({selectedItem : $scope.options.selectedItem, selectedIndex :  $scope.options.selectedIndex});
                        return;
                    }
                    if($scope.selectedButton){
                        angular.element($scope.selectedButton).removeClass('active');
                    }
                    $scope.selectedButton = event.currentTarget;
                    angular.element($scope.selectedButton).addClass('active');
                    $scope.options.selectedIndex = event.currentTarget.getAttribute('index');
                    $scope.options.selectedItem = $scope.dataProvider[$scope.options.selectedIndex];
                    if($scope.options.onChange)
                        $scope.options.onChange({selectedItem : $scope.options.selectedItem, selectedIndex :  $scope.options.selectedIndex});
                }
            })
        }
    }
    return {
        restrict: 'E',
        template: '<div class="button-bar"></div>',
        scope: {
            dataProvider: '=source',
            options : '=options'
        },
        link: link
    };
}]);


