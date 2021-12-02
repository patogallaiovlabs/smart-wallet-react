

export default function Address(props:{
    value:string | undefined,
    tail?:boolean,
    length?:number
}) {
    return (<span>
                {props.value?.toLowerCase().substring(0, props.length??props.value.length) + ((props.length && props.value && props.length < props.value.length)?'...':'')}
                {props.tail?
                    props.value?.substring(props.value.length-4, props.value.length)
                    :''}
            </span>
    );
}