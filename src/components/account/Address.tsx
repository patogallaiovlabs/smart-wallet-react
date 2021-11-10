

export default function Address(props:{
    value:string | undefined,
    tail?:boolean
}) {
    return (<span>
                {props.value?.substring(0, 5)}
                ...
                {props.tail?
                    props.value?.substring(props.value.length-4, props.value.length)
                    :''}
            </span>
    );
}