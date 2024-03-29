import React, { useState, useEffect } from 'react';
import qs from 'qs';

import { Wrapper, Card, Templates, Form, Button } from './styles';
import logo from '../../images/logo.svg';

export default function Home() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [generateMeme, setGenerateMeme] = useState(null);

    useEffect(() => {
        (async () => {
            const resp = await fetch('https://api.imgflip.com/get_memes');
            const { data: { memes } } = await resp.json();
            setTemplates(memes);
        })();
    }, []);

    // currying -> funcção que retorna outra função
    const handleInputChange = (index) => (e) => {
        const newValues = boxes;
        newValues[index] = e.target.value;
        setBoxes(newValues);
    };

    function handleSelectTemplate(template) {
        setSelectedTemplate(template);
        setBoxes([]);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const params = qs.stringify({ // qs = querye string
            template_id: selectedTemplate.id,
            username: 'Reinansouza',
            password: 'figmaVida',
            boxes: boxes.map(text => ({ text })),
        });

        const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
        const { data: { url } } = await resp.json();

        setGenerateMeme(url);
    }

    function handleReset() {
        setSelectedTemplate(null);
        setBoxes([]);
        setGenerateMeme(null);
    }

    return (
        <Wrapper>
            <img src={logo} alt="MemeMaker" />

            <Card>
                {generateMeme && (
                    <>
                        <img src={generateMeme} alt="Generated Meme" />
                        <Button type="button" onClick={handleReset}>Criar outro Meme</Button>
                    </>
                )}
                {!generateMeme && (
                    <>
                        <h2>Selecione um template</h2>
                        <Templates>
                            {templates.map((template) => (
                                <button 
                                key={template.id}
                                type="button" 
                                onClick={() => handleSelectTemplate(template)} 
                                className={template.id === selectedTemplate?.id ? 'selected' : ''}
                                >
                                <img src={template.url} alt={template.name} />
                                </button>
                            ))}
                        </Templates>

                        {selectedTemplate && (
                            <>
                                <h2>Textos</h2>
                                <Form onSubmit={handleSubmit}>
                                    {(new
                                    Array(selectedTemplate.box_count)).fill('').map((_, index) => (
                                        <input
                                        key={String(Math.random())}
                                        placeholder={`Text #${index + 1}`}
                                        onChange={handleInputChange(index)}
                                        />
                                    ))}
                                    
                                    <Button type="submit">MakeMyMeme!</Button>

                                </Form>
                            </>
                        )}
                    </>
                )}
            </Card>
        </Wrapper>
    );
}