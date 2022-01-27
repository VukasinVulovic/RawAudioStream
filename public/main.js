async function main() {
    const res = await fetch('/audio', { responseType: 'arraybuffer' });
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    
    const read = async() => {
        const { done, value} = await reader.read();
    
        if(done)
            return;
    
        const v = stringToFloatArr(value);
        await playAudio(v);
        read();
    }

    read();
}

function stringToFloatArr(str) {
    const arr = [];

    str.split(',').forEach(f => arr.push(parseFloat(f)));
    return new Float32Array(arr);
}

window.onclick = () => main().catch(console.error);

function playAudio(raw_array, channels=1, sample_rate=41000) {
    return new Promise(resolve => {
        const ctx = new AudioContext();
        const arr_buff = ctx.createBuffer(channels, raw_array.length, sample_rate * channels); //create a buffer and change sample rate accordingly so output is mono
        const source = ctx.createBufferSource();
    
        arr_buff.getChannelData(0).set(raw_array); //add data to cahnnel 0(L)
    
        if(arr_buff.numberOfChannels > 1)
            arr_buff.getChannelData(1).set(raw_array); //add data to cahnnel 1(R)
        
        source.buffer = arr_buff; //set buffer
        source.connect(ctx.destination); //connect to speakers
        source.start(); //play audio

        source.onended = () => ctx.close().then(resolve);
    })
}